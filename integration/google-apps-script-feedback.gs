/**
 * Jopeem Pharmacy feedback endpoint and private dashboard API.
 * Bind this Apps Script project to the Google Sheet that stores Feedback.
 */

const FEEDBACK_SHEET_NAME = 'Feedback';
const FEEDBACK_HEADERS = [
  'Timestamp',
  'Rating',
  'Feedback Type',
  'Branch',
  'Comment',
  'Source'
];
const FEEDBACK_TYPES = [
  'Website experience',
  'Product availability',
  'Service experience',
  'Staff/customer care',
  'Other'
];
const FEEDBACK_BRANCHES = [
  'Nyanama Trading Centre',
  'Lebron Shopping Complex, Nalumunye'
];
const DASHBOARD_SESSION_PREFIX = 'jopeem_dashboard_session_';
const DASHBOARD_FAILED_PREFIX = 'jopeem_dashboard_failed_';
const DASHBOARD_SESSION_SECONDS = 3600;
const DASHBOARD_FAILED_LIMIT = 5;
const DASHBOARD_COOLDOWN_SECONDS = 300;

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = String(params.action || '').trim();

  if (action === 'login') {
    return dashboardLogin_(params);
  }
  if (action === 'feedbackData') {
    return dashboardData_(params);
  }
  if (action === 'logout') {
    return dashboardLogout_(params);
  }

  return saveFeedback_(params);
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = String(params.action || '').trim();

  // Dashboard data/logout can be read through GET when needed, but login
  // deliberately remains POST-only so passwords are not placed in URLs.
  if (action === 'feedbackData') {
    return dashboardData_(params);
  }
  if (action === 'logout') {
    return dashboardLogout_(params);
  }

  return feedbackJson_({
    success: false,
    message: 'Unsupported request.'
  });
}

function saveFeedback_(params) {
  try {
    const rating = Number(params.rating);
    const feedbackType = String(params.feedbackType || '').trim();
    const branch = String(params.branch || '').trim();
    const comment = String(params.comment || '').trim().slice(0, 500);
    const source = String(params.source || 'Website').trim().slice(0, 80) || 'Website';

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Invalid rating');
    }
    if (FEEDBACK_TYPES.indexOf(feedbackType) === -1) {
      throw new Error('Invalid feedback type');
    }
    if (FEEDBACK_BRANCHES.indexOf(branch) === -1) {
      throw new Error('Invalid branch');
    }

    const sheet = getFeedbackSheet_();
    sheet.appendRow([
      new Date(),
      rating,
      feedbackType,
      branch,
      comment,
      source
    ]);

    return feedbackJson_({ success: true });
  } catch (error) {
    console.error(error);
    return feedbackJson_({
      success: false,
      message: 'Unable to save feedback.'
    });
  }
}

function dashboardLogin_(params) {
  const password = String(params.password || '');
  const clientKey = cleanDashboardClientKey_(params.clientKey);
  const cache = CacheService.getScriptCache();
  const failedKey = DASHBOARD_FAILED_PREFIX + clientKey;
  const failed = readDashboardFailure_(cache, failedKey);
  const now = Date.now();

  if (failed.cooldownUntil && failed.cooldownUntil > now) {
    return feedbackJson_({
      success: false,
      message: 'Incorrect password.'
    });
  }

  const configuredPassword = PropertiesService
    .getScriptProperties()
    .getProperty('DASHBOARD_PASSWORD');

  if (!configuredPassword || password !== configuredPassword) {
    const nextCount = failed.count + 1;
    const next = {
      count: nextCount,
      cooldownUntil: nextCount >= DASHBOARD_FAILED_LIMIT
        ? now + DASHBOARD_COOLDOWN_SECONDS * 1000
        : 0
    };
    cache.put(
      failedKey,
      JSON.stringify(next),
      next.cooldownUntil
        ? DASHBOARD_COOLDOWN_SECONDS
        : DASHBOARD_COOLDOWN_SECONDS
    );

    return feedbackJson_({
      success: false,
      message: 'Incorrect password.'
    });
  }

  cache.remove(failedKey);

  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  cache.put(
    DASHBOARD_SESSION_PREFIX + token,
    JSON.stringify({ expiresAt: now + DASHBOARD_SESSION_SECONDS * 1000 }),
    DASHBOARD_SESSION_SECONDS
  );

  return feedbackJson_({
    success: true,
    token: token
  });
}

function dashboardData_(params) {
  if (!validateDashboardSession_(params.token)) {
    return feedbackJson_({
      success: false,
      unauthorized: true,
      message: 'Please sign in again.'
    });
  }

  try {
    return feedbackJson_(Object.assign({
      success: true
    }, buildDashboardData_()));
  } catch (error) {
    console.error(error);
    return feedbackJson_({
      success: false,
      message: 'Unable to load feedback.'
    });
  }
}

function dashboardLogout_(params) {
  const token = String(params.token || '').trim();
  if (token) {
    CacheService.getScriptCache().remove(DASHBOARD_SESSION_PREFIX + token);
  }
  return feedbackJson_({ success: true });
}

function validateDashboardSession_(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) return false;

  const stored = CacheService.getScriptCache()
    .get(DASHBOARD_SESSION_PREFIX + cleanToken);
  if (!stored) return false;

  try {
    const session = JSON.parse(stored);
    return Number(session.expiresAt) > Date.now();
  } catch (error) {
    return false;
  }
}

function readDashboardFailure_(cache, key) {
  try {
    const parsed = JSON.parse(cache.get(key) || '{}');
    return {
      count: Number(parsed.count) || 0,
      cooldownUntil: Number(parsed.cooldownUntil) || 0
    };
  } catch (error) {
    return { count: 0, cooldownUntil: 0 };
  }
}

function cleanDashboardClientKey_(value) {
  const cleaned = String(value || 'unknown')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 80);
  return cleaned || 'unknown';
}

function buildDashboardData_() {
  const sheet = getFeedbackSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.length ? values[0].map(function(header) {
    return String(header || '').trim().toLowerCase();
  }) : [];
  const index = function(name, fallback) {
    const found = headers.indexOf(name.toLowerCase());
    return found === -1 ? fallback : found;
  };

  const timestampIndex = index('timestamp', 0);
  const ratingIndex = index('rating', 1);
  const typeIndex = index('feedback type', 2);
  const branchIndex = index('branch', 3);
  const commentIndex = index('comment', 4);
  const sourceIndex = index('source', 5);
  const records = [];

  values.slice(1).forEach(function(row) {
    const rating = Number(row[ratingIndex]);
    const feedbackType = String(row[typeIndex] || '').trim();
    const branch = String(row[branchIndex] || '').trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return;
    if (FEEDBACK_TYPES.indexOf(feedbackType) === -1) return;
    if (FEEDBACK_BRANCHES.indexOf(branch) === -1) return;

    const timestamp = row[timestampIndex];
    records.push({
      sortTime: timestamp instanceof Date ? timestamp.getTime() : 0,
      timestamp: formatDashboardTimestamp_(timestamp),
      rating: rating,
      feedbackType: feedbackType,
      branch: branch,
      comment: String(row[commentIndex] || '').slice(0, 500),
      source: String(row[sourceIndex] || '').trim().slice(0, 80)
    });
  });

  records.sort(function(a, b) {
    return b.sortTime - a.sortTime;
  });

  const ratings = { '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 };
  const types = {};
  const branches = {};
  FEEDBACK_TYPES.forEach(function(type) { types[type] = 0; });
  FEEDBACK_BRANCHES.forEach(function(branch) {
    branches[branch] = { count: 0, ratingTotal: 0, averageRating: 0 };
  });

  let ratingTotal = 0;
  records.forEach(function(record) {
    ratings[record.rating + (record.rating === 1 ? ' star' : ' stars')]++;
    types[record.feedbackType]++;
    ratingTotal += record.rating;
    branches[record.branch].count++;
    branches[record.branch].ratingTotal += record.rating;
  });

  FEEDBACK_BRANCHES.forEach(function(branch) {
    const item = branches[branch];
    item.averageRating = item.count
      ? Math.round(item.ratingTotal / item.count * 10) / 10
      : 0;
    delete item.ratingTotal;
  });

  const recent = records.slice(0, 250).map(function(record) {
    return {
      timestamp: record.timestamp,
      rating: record.rating,
      feedbackType: record.feedbackType,
      branch: record.branch,
      comment: record.comment,
      source: record.source
    };
  });

  return {
    summary: {
      total: records.length,
      averageRating: records.length
        ? Math.round(ratingTotal / records.length * 10) / 10
        : 0,
      fiveStar: records.filter(function(record) {
        return record.rating === 5;
      }).length,
      lowRatings: records.filter(function(record) {
        return record.rating === 1 || record.rating === 2;
      }).length
    },
    ratings: ratings,
    types: types,
    branches: branches,
    feedback: recent
  };
}

function formatDashboardTimestamp_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone() || 'Africa/Kampala',
      'dd MMM yyyy, HH:mm'
    );
  }
  return String(value || '');
}

function getFeedbackSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(FEEDBACK_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(FEEDBACK_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).setValues([FEEDBACK_HEADERS]);
  }

  return sheet;
}

function feedbackJson_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
