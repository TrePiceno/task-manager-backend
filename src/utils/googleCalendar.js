// src/utils/googleCalendar.js
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function crearEvento(evento) {
    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: evento,
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear el evento:', error);
        throw error;
    }
}

module.exports = { crearEvento };