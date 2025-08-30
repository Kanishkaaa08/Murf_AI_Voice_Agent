# 30 Days of Voice Agents Challenge 🚀

Welcome to the **30 Days of Voice Agents Challenge** repository! This project represents my journey in building an interactive, voice-activated **alien AI** called **ZORION**. ZORION listens, understands, and responds intelligently in real-time, giving users a unique conversational experience.

👽 **Meet ZORION**, your Alien Voice Agent from Andromeda!

---

## 🤖 **About The Project**

This project is all about creating a **sophisticated, voice-powered AI agent** that interacts with users through **natural voice conversations**. It integrates multiple AI technologies and APIs, including **speech-to-text**, **large language models**, and **text-to-speech**.

**ZORION** isn't just another assistant; it's an **alien entity from Andromeda**, designed to add a touch of otherworldly charm while providing useful information, like the weather or web searches. The agent understands the context of conversations, making interactions feel more human-like.

### Key Features 🌟

- 🎤 **Voice-to-Voice Interaction**: Talk to ZORION, and get an immediate, spoken response.
- 🌐 **Contextual Conversations**: ZORION understands the flow of dialogue and responds intelligently.
- 🤖 **End-to-End AI Pipeline**: Speech-to-Text → Google Gemini → Text-to-Speech, working in harmony.
- 🌤 **Weather Updates**: Ask ZORION for real-time weather forecasts.
- 🔍 **Web Search**: ZORION can perform searches for you.
- 👽 **Alien Persona**: ZORION adds fun with its unique alien personality.
- 🖥️ **Modern UI**: A clean, intuitive interface with a one-click recording button.
- 🛠️ **Robust Error Handling**: Graceful fallback messages when APIs fail.
- 🚀 **Live Deployment**: ZORION is hosted on Render.com and accessible online!

---

## 🛠️ **Tech Stack**

This project uses various technologies for both the frontend and backend:

### **Backend**:
- **FastAPI**: Fast and asynchronous API framework for building backend services.
- **Uvicorn**: ASGI server to run the FastAPI app.
- **Python-Dotenv**: To manage environment variables securely.
- **WebSockets**: For real-time communication between the server and the client.

### **Frontend**:
- **HTML, CSS, JavaScript**: Core technologies for the interface and client-side logic.
- **Bootstrap 5**: For a responsive design and modern UI.
- **MediaRecorder API**: To capture and stream audio directly from the user's microphone.

### **AI & Voice APIs**:
- **Murf AI**: Converts text to high-quality, natural-sounding speech (TTS).
- **AssemblyAI**: Provides real-time transcription of audio into text (STT).
- **Google Gemini**: Powers intelligent, context-aware responses with advanced LLM.
- **SerpAPI**: Fetches real-time search results from Google.
- **Weather API**: Retrieves weather data for any location.

### **Deployment**:
- **Render.com**: Cloud service for hosting the application.

---

## ⚙️ **Architecture Overview**

The system is built with a **client-server architecture**, where the frontend captures voice and sends it to the backend for processing.

1. **Client** captures audio using the **MediaRecorder API** and sends it to the **FastAPI server**.
2. The server sends the audio to **AssemblyAI** for Speech-to-Text conversion.
3. The transcribed text is sent to **Google Gemini** for generating a response.
4. The response is then sent to **Murf AI** for Text-to-Speech (TTS).
5. **ZORION** responds verbally, and the conversation continues.

Additionally:
- **Weather API**: To fetch weather updates when asked.
- **SerpAPI**: Allows ZORION to fetch answers from the web.

---

## 🚀 **Getting Started**

### **Try the Live Agent** 🌌

ZORION is live and ready for interaction! You can access it [here](https://voice-agent-kzw7.onrender.com/).

To start:
1. Click the settings icon to enter your **API keys**.
2. Grant microphone permissions.
3. Start chatting with ZORION!

### **Running Locally** 🖥️

To run ZORION on your local machine, follow these steps:

#### **Prerequisites**:
- Python 3.8+
- API keys for:
  - Murf AI
  - AssemblyAI
  - Google Gemini
  - SerpAPI
  - Weather API

#### **Installation**:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/kanishkaaa08/voice-agent.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd voice-agent
    ```

3. **Install the dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Create a `.env` file** in the root directory with your API keys:
    ```ini
    MURF_API_KEY="your_murf_api_key_here"
    ASSEMBLYAI_API_KEY="your_assemblyai_api_key_here"
    GOOGLE_API_KEY="your_google_genai_key_here"
    SERP_API_KEY="your_serp_api_key_here"
    WEATHER_API_KEY="your_weather_api_key_here"
    ```

5. **Run the FastAPI server**:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

6. **Open your browser** and go to `http://localhost:8000`. Grant microphone permissions and start chatting with ZORION!

---

## 📂 **Project Structure**

Here’s how the project is structured:

````

AI Voice Agent/
├── app.py           # Main application file handling the backend API
├── Services/        # Core functionalities of ZORION
│   ├── llm.py       # Handles interactions with Google Gemini LLM
│   ├── stt.py       # Real-time speech-to-text
│   └── tts.py       # Text-to-speech conversion
├── templates/
│   └── index.html   # Main UI for the voice agent
├── static/
│   ├── script.js    # Frontend logic for recording and settings
│   └── style.css    # UI styles
├── requirements.txt # Lists all project dependencies
└── .env             # Stores API keys

```

---

## 🗓️ **Project Journey: Day 1 to 29**

Here’s a quick summary of the progress I made during the challenge:

- **Day 01**: Laid the foundation with a basic **FastAPI server** and **Bootstrap UI**.
- **Day 02**: Integrated the **Murf AI API** for **Text-to-Speech (TTS)**.
- **Day 03**: Built the **frontend interface** to interact with TTS.
- **Day 04**: Developed a client-side **Echo Bot** using **MediaRecorder API**.
- **Day 05**: Enhanced the Echo Bot with **server-side audio upload**.
- **Day 06**: Integrated **AssemblyAI** for **Speech-to-Text (STT)**.
- **Day 07**: Created a **voice transformation bot** with STT and TTS.
- **Day 08**: Integrated **Google Gemini LLM** for intelligent responses.
- **Day 09**: Achieved a **full voice-to-voice conversational loop**.
- **Day 10**: Implemented **chat history** and **session management**.
- **Day 11**: Added **error handling** for server-side and client-side issues.
- **Day 12**: Revamped UI with a **single, animated record button**.
- **Day 13**: Focused on **documentation** and creating a clear README.
- **Day 14 - 26**: Added **persona**, **web search**, and **weather updates**.
- **Day 27**: Improved UI with **settings panel** for API key configuration.
- **Day 28**: **Deployed** the agent to a cloud server for public use.

---

This project has been an exciting ride! Let me know if you have any questions, and feel free to contribute or explore the code. Enjoy chatting with **ZORION**! 👽✨

---
