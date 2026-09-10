# Customer feedback setup

## Google Sheet

Create or use a Google Sheet connected to the Apps Script project. Create a worksheet/tab named Feedback and add this header row:

Timestamp | Rating | Feedback Type | Branch | Comment | Source

## Apps Script deployment

1. Open the Google Sheet and choose Extensions → Apps Script.
2. Copy the code from integration/google-apps-script-feedback.gs into the Apps Script project.
3. Confirm the script is connected to the Feedback spreadsheet.
4. Deploy it as a Web app.
5. Choose the appropriate access permission for the intended public website submissions.
6. Copy the deployed Web App URL.
7. Replace the FEEDBACK_ENDPOINT value in app.js with the deployed Web App URL.
8. Publish the updated website.

The Apps Script creates the Feedback tab and headers if they are missing, validates all fields, and creates the timestamp on the server.
