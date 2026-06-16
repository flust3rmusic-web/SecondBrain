require("dotenv").config();

function parseDateTime(message) {

    const text =
        message.toLowerCase();

    const start =
        new Date();

    // TODAY

    if (
        text.includes("today")
    ) {
        // keep today
    }

    // TOMORROW

    else if (
        text.includes("tomorrow")
    ) {

        start.setDate(
            start.getDate() + 1
        );
    }

    // 7pm / 7:30pm

    const timeMatch =
        text.match(
            /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i
        );

    if (timeMatch) {

        let hour =
            parseInt(
                timeMatch[1]
            );

        let minute =
            parseInt(
                timeMatch[2] || "0"
            );

        const period =
            timeMatch[3]
                .toLowerCase();

        if (
            period === "pm" &&
            hour < 12
        ) {

            hour += 12;
        }

        if (
            period === "am" &&
            hour === 12
        ) {

            hour = 0;
        }

        start.setHours(
            hour,
            minute,
            0,
            0
        );
    }

    const end =
        new Date(
            start.getTime() +
            60 * 60 * 1000
        );

    return {
        start,
        end
    };
}

module.exports = {
    parseDateTime
};