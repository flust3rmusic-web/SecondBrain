from faster_whisper import WhisperModel
import sys

sys.stdout.reconfigure(
    encoding="utf-8"
)

audio_file = sys.argv[1]

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    audio_file,
    language="en"
)

text = ""

for segment in segments:
    text += segment.text + " "

print(text.strip())