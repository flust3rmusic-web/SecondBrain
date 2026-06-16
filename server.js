require("dotenv").config();

const {
    deleteNote
} =
    require(
        "./services/deleteNote"
    );

const {
    decideVoiceAction
} =
    require(
        "./services/voiceAgent"
    );

const {
    saveMelody
} =
    require(
        "./services/melody"
    );

const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadMediaMessage
} = require("@whiskeysockets/baileys");

const qrcode =
    require("qrcode-terminal");

const { askAI } =
    require("./services/ai");

const { saveNote } =
    require("./services/obsidian");

const { createEvent } =
    require("./services/calendar");

const { parseDateTime } =
    require("./services/dateParser");

const {
    transcribeAudio
} =
    require(
        "./services/transcriber"
    );

const fs =
    require("fs");

const path =
    require("path");

const AI_GROUP =
    process.env.AI_GROUP;

let melodyMode = false;

let noteHistory = [];

async function startBot() {

    const {
        state,
        saveCreds
    } =
        await useMultiFileAuthState(
            "./auth"
        );

    const sock =
        makeWASocket({
            auth: state
        });

    sock.ev.on(
        "creds.update",
        saveCreds
    );

    sock.ev.on(
        "connection.update",
        ({ connection, qr }) => {

            if (qr) {

                console.log(
                    "\nSCAN QR:\n"
                );

                qrcode.generate(
                    qr,
                    { small: true }
                );
            }

            if (
                connection === "open"
            ) {

                console.log(
                    "✅ CONNECTED"
                );
            }
        }
    );

    sock.ev.on(
        "messages.upsert",
        
        async ({ messages }) => {

            try {

                const msg =
                    messages[0];

                if (
                    !msg?.message
                ) {
                    return;
                }

                if (
                    msg.key.remoteJid !==
                    AI_GROUP
                ) {
                    return;
                }

                // VOICE NOTES

            const voiceMessage =
                msg.message?.audioMessage;

            if (
                voiceMessage
            ) {

                console.log(
                    "VOICE NOTE DETECTED"
                );

                const buffer =
                    await downloadMediaMessage(
                        msg,
                        "buffer",
                        {}
                    );

                const filePath =
                    path.join(
                        process.cwd(),
                        "temp",
                        "voice",
                        `voice-${Date.now()}.ogg`
                    );

                fs.writeFileSync(
                    filePath,
                    buffer
                );

                console.log(
                    "VOICE SAVED:",
                    filePath
                );

                const transcript =
                    await transcribeAudio(
                        filePath
                    );

                const lowerTranscript =
                    transcript
                        .toLowerCase()
                        .trim();

                if (

                    lowerTranscript.includes(
                        "delete last note"
                    )

                    ||

                    lowerTranscript.includes(
                        "delete the last note"
                    )

                    ||

                    lowerTranscript.includes(
                        "remove last note"
                    )

                    ||

                    lowerTranscript.includes(
                        "undo note"
                    )

                )
                
                {

                    if (
                        noteHistory.length === 0
                    ) {

                        await sock.sendMessage(
                            AI_GROUP,
                            {
                                text:
                                    "No notes in history."
                            }
                        );

                        return;
                    }

                    const lastNote =
                        noteHistory.pop();

                    const success =
                        deleteNote(
                            lastNote
                        );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                success
                                    ? "🗑 Note Deleted"
                                    : "Could not find note."
                        }
                    );

                    return;
                }

                    
                console.log(
                    "TRANSCRIPT:",
                    transcript
                );
                if (
                    melodyMode
                ) {

                    const noteName =
                        saveMelody(
                            filePath,
                            transcript
                        );

                    melodyMode = false;

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "🎵 Melody Saved\n" +
                                noteName
                        }
                    );

                    return;
                }
                
                console.log(
                    "TRANSCRIPT:",
                    transcript
                );

                const voiceAction =
                    decideVoiceAction(
                        transcript
                    );

                console.log(
                    "VOICE ACTION:",
                    voiceAction
                );

                // CALENDAR

                if (
                    voiceAction ===
                    "calendar"
                ) {

                    const {
                        start,
                        end
                    } =
                        parseDateTime(
                            transcript
                        );

                    const title =
                        transcript
                            .replace(/today/gi, "")
                            .replace(/tomorrow/gi, "")
                            .replace(
                                /\d{1,2}(:\d{2})?\s*(am|pm)/gi,
                                ""
                            )
                            .replace(/at/gi, "")
                            .trim();

                    await createEvent(
                        title,
                        start.toISOString(),
                        end.toISOString()
                    );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "📅 Event Added To Calendar"
                        }
                    );

                    return;
                }

                // NOTE

                if (
                    voiceAction ===
                    "note"
                ) {

                    const filename =
                        saveNote(
                            transcript
                        );

                        noteHistory.push(
                            filename
                        );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "📝 Note Saved\n" +
                                filename
                        }
                    );

                    return;
                }

                // CHAT

                const answer =
                    await askAI(
                        transcript
                    );

                await sock.sendMessage(
                    AI_GROUP,
                    {
                        text:
                            "AI: " +
                            answer
                    }
                );

                return;
            
                
            }

                let text = "";

                if (
                    msg.message.conversation
                ) {

                    text =
                        msg.message.conversation;
                }
                else if (
                    msg.message.extendedTextMessage?.text
                ) {

                    text =
                        msg.message.extendedTextMessage.text;
                }

                if (!text) {
                    return;
                }

                console.log(
                    "\n================="
                );

                console.log(
                    "MESSAGE:",
                    text
                );

                // STOP LOOPS

                if (
                    text.startsWith("AI:") ||
                    text.startsWith("📝") ||
                    text.startsWith("📅") ||
                    text.startsWith("🎤") ||
                    text.startsWith("🎵") ||
                    text.startsWith("🗑")
                ) {

                    console.log(
                        "IGNORING BOT MESSAGE"
                    );

                    return;
                }

                const lower =
                    text.toLowerCase();

                if (
                    lower ===
                    "delete last note"
                ) {

                    if (
                        noteHistory.length === 0
                    ) {

                        await sock.sendMessage(
                            AI_GROUP,
                            {
                                text:
                                    "No notes in history."
                            }
                        );

                        return;
                    }

                    const lastNote =
                        noteHistory.pop();

                    const success =
                        deleteNote(
                            lastNote
                        );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                success
                                    ? "🗑 Note Deleted"
                                    : "Could not find note."
                        }
                    );

                    return;
                }

                if (
                    lower === "melody"
                ) {

                    melodyMode = true;

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "🎵 Melody mode enabled\nSend a voice note."
                        }
                    );

                    return;
                }

                // NOTES

                if (
                    lower.startsWith(
                        "note:"
                    )
                ) {

                    const noteText =
                        text
                            .substring(5)
                            .trim();

                    const filename =
                        saveNote(
                            noteText
                        );

                    console.log(
                        "NOTE SAVED:",
                        filename
                    );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "📝 Note Saved\n" +
                                filename
                        }
                    );

                    return;
                }

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
                    "hour",
                    "meeting",
                    "appointment",
                    "call"
                ];

                const isCalendar =
                    calendarWords.some(
                        word =>
                            lower.includes(
                                word
                            )
                    );

                if (
                    isCalendar
                ) {

                    console.log(
                        "CALENDAR EVENT DETECTED"
                    );

                    const {
                        start,
                        end
                    } =
                        parseDateTime(
                            text
                        );

                const title =
                    text
                        .replace(/today/gi, "")
                        .replace(/tomorrow/gi, "")
                        .replace(
                            /\d{1,2}(:\d{2})?\s*(am|pm)/gi,
                            ""
                        )
                        .replace(/at/gi, "")
                        .trim();

                const link =
                    await createEvent(
                        title,
                        start.toISOString(),
                        end.toISOString()
                    );

                    console.log(
                        "EVENT CREATED"
                    );

                    await sock.sendMessage(
                        AI_GROUP,
                        {
                            text:
                                "📅 Event Added To Calendar\n" +
                                link
                        }
                    );

                    return;
                }

                // CHAT

                console.log(
                    "CALLING OLLAMA..."
                );

                const answer =
                    await askAI(
                        text
                    );

                console.log(
                    "OLLAMA REPLIED"
                );

                await sock.sendMessage(
                    AI_GROUP,
                    {
                        text:
                            "AI: " +
                            answer
                    }
                );

                console.log(
                    "REPLY SENT"
                );

            }
            catch (error) {

                console.log(
                    "\n===== ERROR ====="
                );

                console.error(
                    error
                );

                console.log(
                    "=================\n"
                );
            }
        }
    );
}

startBot();