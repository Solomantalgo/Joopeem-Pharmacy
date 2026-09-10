# Customer feedback and private dashboard setup

## Google Sheet

Use a Google Sheet connected to the Apps Script project. Create a worksheet/tab named **Feedback** with this header row:

Timestamp | Rating | Feedback Type | Branch | Comment | Source

The script creates the tab and headers if they are missing.

## Apps Script deployment

1. Open the Google Sheet and choose **Extensions -> Apps Script**.
2. Copy the code from `integration/google-apps-script-feedback.gs`.
3. Confirm the script is bound to the Feedback spreadsheet.
4. In **Project Settings -> Script Properties**, add:
   - Property: `DASHBOARD_PASSWORD`
   - Value: the private password chosen for William
5. Deploy as a **Web app** and choose the access permission required for public customer feedback submissions.
6. Copy the deployed Web App URL and set it as `FEEDBACK_ENDPOINT` in `app.js` and `DASHBOARD_ENDPOINT` in `dashboard.js`.
7. Publish the updated website.

After changing Apps Script, deploy a new version of the Web App. Customer feedback continues to use POST without an action; dashboard requests use POST actions `login`, `feedbackData`, and `logout`.

## Private dashboard

Open `dashboard.html` directly when needed. It is intentionally not linked from the customer navigation.

The login password is never stored in the website. Successful login returns a temporary server-side session token. The browser keeps only that token in sessionStorage under `jopeem-dashboard-session`. Sessions expire after about 60 minutes, and Logout invalidates the token server-side when possible.

Dashboard responses include summary metrics, rating/type/branch breakdowns, and the newest feedback rows. Feedback comments are rendered as text, not HTML.