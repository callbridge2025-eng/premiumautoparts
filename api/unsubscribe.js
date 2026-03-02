import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get all rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:C",
    });

    const rows = response.data.values || [];

    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === email) {
        rowIndex = i + 1; // Sheet rows start at 1
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Update Status column (Column B)
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: `Sheet1!B${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["unsubscribed"]],
      },
    });

    return res.status(200).json({
      message: "You have been unsubscribed successfully."
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error processing unsubscribe request.",
      error: error.message
    });
  }
}
