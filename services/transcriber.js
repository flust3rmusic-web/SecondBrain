const { exec } =
require("child_process");

function transcribeAudio(
    filePath
) {

    return new Promise(
        (resolve, reject) => {

            exec(
                `python services/transcribe.py "${filePath}"`,
                {
                    maxBuffer:
                        1024 * 1024 * 10
                },
                (
                    error,
                    stdout,
                    stderr
                ) => {

                    if (error) {

                        reject(error);

                        return;
                    }

                    resolve(
                        stdout
                            .toString()
                            .trim()
                    );
                }
            );
        }
    );
}

module.exports = {
    transcribeAudio
};