function decideVoiceAction(
    text
) {

    const lower =
        text.toLowerCase();

    // CALENDAR

    const calendarWords = [
        "today",
        "tomorrow",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "am",
        "pm",
        "meeting",
        "appointment",
        "call",
        "schedule",
        "remind me",
        "reminder"
    ];

    if (
        calendarWords.some(
            word =>
                lower.includes(word)
        )
    ) {

        return "calendar";
    }

    // QUESTIONS

    const questionWords = [
        "what",
        "why",
        "how",
        "when",
        "where",
        "who",
        "which",
        "explain",
        "tell me",
        "can you",
        "could you"
    ];

    if (
        questionWords.some(
            word =>
                lower.startsWith(word)
        )
    ) {

        return "chat";
    }

    // NOTES

    const noteWords = [
        "idea",
        "business idea",
        "youtube idea",
        "note",
        "remember",
        "journal",
        "thought"
    ];

    if (
        noteWords.some(
            word =>
                lower.includes(word)
        )
    ) {

        return "note";
    }

    // SHORT THINGS → NOTES

    const words =
        lower
            .split(" ")
            .filter(Boolean);

    if (
        words.length <= 6
    ) {

        return "note";
    }

    // EVERYTHING ELSE → AI

    return "chat";
}

module.exports = {
    decideVoiceAction
};