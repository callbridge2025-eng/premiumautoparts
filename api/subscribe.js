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

    // Get existing emails
    const read = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:A",
    });

    const rows = read.data.values || [];
    const existingEmails = rows.flat();

    if (existingEmails.includes(email)) {
      return res.status(200).json({ message: "Email already subscribed." });
    }

    // Append new email
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[email, "active", new Date().toISOString()]],
      },
    });

    return res.status(200).json({ message: "Subscribed successfully." });

  } catch (error) {
    return res.status(500).json({
      message: "Error saving email",
      error: error.message
    });
  }
}
