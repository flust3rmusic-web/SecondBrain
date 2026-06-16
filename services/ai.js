require("dotenv").config();

const axios =
    require("axios");

async function askAI(
    message
) {

    const response =
        await axios.post(
            "http://127.0.0.1:11434/api/generate",
            {
                model:
                    process.env.OLLAMA_MODEL,
                prompt: message,
                stream: false
            },
            {
                timeout: 180000
            }
        );

    return response.data.response;
}

module.exports = {
    askAI
};