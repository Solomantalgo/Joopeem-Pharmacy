/**
 * Jopeem Pharmacy customer feedback endpoint.
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

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
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
