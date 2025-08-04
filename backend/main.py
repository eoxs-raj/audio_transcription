# # # // Fast API

# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import tempfile, os
# from transcription import process_audio

# app = FastAPI()

# from transcription import process_audio  # ✅ Assuming the file is transcription.py

# @app.post("/transcribe/")
# async def transcribe(file: UploadFile = File(...)):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#         tmp.write(await file.read())
#         tmp_path = tmp.name

#     transcript = process_audio(tmp_path)
#     os.remove(tmp_path)
#     return {"transcript": transcript}


# backend/main.py

# main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile, os
from transcription import process_audio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    if file.content_type != "audio/mpeg":
        raise HTTPException(status_code=400, detail="Only MP3 files are allowed.")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        transcript = process_audio(tmp_path)
        return {"transcript": transcript}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

