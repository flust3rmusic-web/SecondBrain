require("dotenv").config();

const fs =
    require("fs");

const path =
    require("path");

function deleteNote(
    filename
) {

    const filePath =
        path.join(
            process.env.OBSIDIAN_INBOX,
            filename
        );

    if (
        !fs.existsSync(
            filePath
        )
    ) {

        return false;
    }

    fs.unlinkSync(
        filePath
    );

    return true;
}

module.exports = {
    deleteNote
};