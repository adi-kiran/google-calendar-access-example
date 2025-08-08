const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const open = require('open');
const fs = require('fs');

dotenv.config();
const app = express();
app.use(express.static('public'));

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// First time: Redirect to Google OAuth
app.get('/auth', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
  res.redirect(url);
});

// Callback from Google with authorization code
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  res.send('Authorization successful! You can now close this tab and go back to the app.');
});

// API: Get free/busy info
app.get('/api/freebusy', async (req, res) => {
  try {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const now = new Date();
    const later = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // next 7 days

    const result = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: later.toISOString(),
        items: [{ id: 'primary' }]
      }
    });

    res.json(result.data.calendars.primary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App running: http://localhost:${process.env.PORT}`);
  // Optional: automatically open browser
//   open(`http://localhost:${process.env.PORT}`);
});
