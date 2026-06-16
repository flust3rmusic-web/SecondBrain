<p align="center">
  <img src="icon.png" width="180">
</p>

# SecondBrain

A voice-first personal assistant that lives inside WhatsApp.

SecondBrain helps you capture thoughts, schedule events, save notes, archive melodies, and chat with a local AI model using natural language and voice messages.

Everything runs locally on your own machine. Your notes, recordings, calendar data, and AI conversations remain private and under your control.

## Features

### 🎤 Voice → Notes

Send a voice note and SecondBrain automatically transcribes and saves it to your Obsidian vault.

### 📅 Voice → Calendar

Say things like:

> "Meeting tomorrow at 5 PM"

SecondBrain creates a Google Calendar event automatically.

### 🤖 Voice & Text → AI Chat

Ask questions through WhatsApp and receive responses from a locally hosted AI model using Ollama.

### 🎵 Melody Capture Mode

Perfect for musicians and creators.

Enable Melody Mode and send a voice note to:

* Save the original audio
* Create an Obsidian note
* Link the recording automatically
* Archive ideas for future use

### 🗑 Delete Last Note

Made a mistake?

Simply say:

> "Delete last note"

and SecondBrain removes the most recently created note.

## Tech Stack

* Node.js
* Baileys (WhatsApp)
* Ollama
* Gemma 3
* Faster-Whisper
* Obsidian
* Google Calendar API
* FFmpeg

## Installation

### Windows

```bash
setup.bat
start.bat
```

### Linux / macOS

```bash
chmod +x setup.sh start.sh

./setup.sh
./start.sh
```

## Manual Setup

### Requirements

* Node.js
* Python 3
* FFmpeg
* Ollama

Install dependencies:

```bash
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

and fill in your settings.

Add your Google Calendar credentials:

```text
service-account.json
```

Start Ollama and ensure your selected model is installed:

```bash
ollama pull gemma3:4b
```

Run:

```bash
node server.js
```

Scan the WhatsApp QR code and you're ready to go.

## Screenshots

### Voice → Calendar

![Voice Calendar](docs/calendar-event.png)

### Voice → Notes

![Voice Notes](docs/voice-note.png)

### Melody Capture

![Melody Mode](docs/melody-mode.png)

## Philosophy

Capture first. Organize automatically.

Instead of switching between apps to manage ideas, reminders, meetings, and creative inspiration, simply send a message or voice note. SecondBrain handles the rest.

## Privacy

SecondBrain is designed to run locally.

No cloud AI services are required. Your voice recordings, notes, calendar data, and AI conversations remain on your own machine.

## License

MIT License
