const fs = require("fs");
const path = require("path");

require("dotenv").config();

const VAULT_PATH =
    process.env.OBSIDIAN_INBOX;

function saveNote(content) {

    const now = new Date();

    const filename =
        now.toISOString()
        .replace(/[:.]/g, "-") +
        ".md";

    const filepath =
        path.join(
            VAULT_PATH,
            filename
        );

    const note =
`# Inbox Note

Created: ${now.toLocaleString()}

${content}
`;

    fs.writeFileSync(
        filepath,
        note
    );

    return filename;
}

module.exports = {
    saveNote
};