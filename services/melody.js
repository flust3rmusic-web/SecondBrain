const fs = require("fs");
const path = require("path");

require("dotenv").config();

const MELODY_PATH =
    process.env.MELODIES_PATH;

function saveMelody(
    audioFile,
    transcript
) {

    const now =
        new Date();

    const timestamp =
        now
            .toISOString()
            .replace(/[:.]/g, "-");

    const audioName =
        `melody-${timestamp}.ogg`;

    const noteName =
        `melody-${timestamp}.md`;

    const audioDest =
        path.join(
            MELODY_PATH,
            audioName
        );

    fs.copyFileSync(
        audioFile,
        audioDest
    );

    const note =

`# Melody Capture

Created:
${now.toLocaleString()}

Audio:
[[${audioName}]]

Transcript:
${transcript || "(No speech detected)"} 
`;

    fs.writeFileSync(
        path.join(
            MELODY_PATH,
            noteName
        ),
        note
    );

    return noteName;
}

module.exports = {
    saveMelody
};