from fastapi import FastAPI, Request, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import assemblyai as aai
import google.generativeai as genai
import logging
import asyncio
import base64
import re

# Import services and config
import config
from services import stt, llm, tts

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = FastAPI()

# Mount static files for CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 👽 Alien Persona Prompt
ALIEN_PERSONA_PROMPT = """
You are a friendly alien engineer from the Andromeda Galaxy.
Always speak like an extraterrestrial sharing futuristic knowledge with Earth engineers.
Use cosmic references (stars, galaxies, warp drives, antimatter) in your answers.
Stay in character and make your tone playful yet wise.
Instead of "Hello", say things like "Intergalactic greetings, Earth engineer!".
"""


@app.get("/")
async def home(request: Request):
    """Serves the main HTML page."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/set-keys")
async def set_keys(request: Request):
    """
    Endpoint to receive API keys from the client and configure the services.
    """
    data = await request.json()
    assembly_key = data.get("assemblyKey")
    gemini_key = data.get("geminiKey")
    murf_key = data.get("murfKey")

    # Ensure all keys are provided
    if not all([assembly_key, gemini_key, murf_key]):
        return {"status": "error", "message": "All API keys are required."}

    # Update configuration and API clients with the new keys
    config.ASSEMBLYAI_API_KEY = assembly_key
    aai.settings.api_key = assembly_key

    config.GEMINI_API_KEY = gemini_key
    genai.configure(api_key=gemini_key)

    config.MURF_API_KEY = murf_key
    # If tts.speak uses config.MURF_API_KEY internally, it will pick up the new value on next call.

    return {"status": "success", "message": "API keys set successfully."}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handles WebSocket connection for real-time transcription and voice response."""
    await websocket.accept()
    logging.info("WebSocket client connected.")

    loop = asyncio.get_event_loop()
    chat_history = []

    async def handle_transcript(text: str):
        """Processes the final transcript, gets LLM and TTS responses, and streams audio."""
        await websocket.send_json({"type": "final", "text": text})

        try:
            # 1. Get the full text response from the LLM with alien persona
            full_response, updated_history = llm.get_llm_response(
                f"{ALIEN_PERSONA_PROMPT}\nHuman: {text}\nAlien:",
                chat_history
            )

            # Update history for the next turn
            chat_history.clear()
            chat_history.extend(updated_history)

            # Send the full text response to the UI
            await websocket.send_json({"type": "assistant", "text": full_response})

            # 2. Split the response into sentences
            sentences = re.split(r'(?<=[.?!])\s+', full_response.strip())

            # 3. Process each sentence for TTS and stream audio back
            for sentence in sentences:
                if sentence.strip():
                    # Run the blocking TTS function in a separate thread
                    audio_bytes = await loop.run_in_executor(
                        None, tts.speak, sentence.strip()
                    )
                    if audio_bytes:
                        b64_audio = base64.b64encode(audio_bytes).decode('utf-8')
                        await websocket.send_json({"type": "audio", "b64": b64_audio})

        except Exception as e:
            logging.error(f"Error in LLM/TTS pipeline: {e}")
            await websocket.send_json({"type": "llm", "text": "Sorry, I encountered an error."})

    def on_final_transcript(text: str):
        logging.info(f"Final transcript received: {text}")
        asyncio.run_coroutine_threadsafe(handle_transcript(text), loop)

    transcriber = stt.AssemblyAIStreamingTranscriber(on_final_callback=on_final_transcript)

    try:
        while True:
            data = await websocket.receive_bytes()
            transcriber.stream_audio(data)
    except Exception as e:
        logging.info(f"WebSocket connection closed: {e}")
    finally:
        transcriber.close()
        logging.info("Transcription resources released.")
