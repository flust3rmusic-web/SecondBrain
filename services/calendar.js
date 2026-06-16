require("dotenv").config();

const { google } = require("googleapis");
const path = require("path");

const auth =
new google.auth.GoogleAuth({
keyFile: path.join(
process.cwd(),
"service-account.json"
),
scopes: [
"https://www.googleapis.com/auth/calendar"
]
});

async function createEvent(
title,
startDate,
endDate
) {

const authClient =
    await auth.getClient();

const calendar =
    google.calendar({
        version: "v3",
        auth: authClient
    });

const event = {
    summary: title,
    start: {
        dateTime: startDate,
        timeZone: "Asia/Kolkata"
    },
    end: {
        dateTime: endDate,
        timeZone: "Asia/Kolkata"
    }
};

const response =
    await calendar.events.insert({
        calendarId:
            process.env.CALENDAR_ID,
        resource: event
    });

return response.data.htmlLink;


}

module.exports = {
createEvent
};
