import whisper
import spacy

WHISPER_MODEL = "base"

# Load models once at startup
print(f"Loading Whisper model ({WHISPER_MODEL})...")
model = whisper.load_model(WHISPER_MODEL)

print("Loading spaCy model...")
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def spacy_sentence_split(text):
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]

def assign_speakers(sentences):
    dialogue = []
    for i, sentence in enumerate(sentences):
        speaker = "Person 1" if i % 2 == 0 else "Person 2"
        dialogue.append(f"{speaker}: {sentence}")
    return "\n".join(dialogue)

def process_audio(file_path: str) -> str:
    result = model.transcribe(file_path)
    raw_text = result["text"]
    sentences = spacy_sentence_split(raw_text)
    dialogue = assign_speakers(sentences)
    return dialogue
