````markdown
# 30 Days of Voice Agents Challenge

Welcome to the **30 Days of Voice Agents Challenge** repository! 🚀

This is my journey of building an interactive, voice-activated **alien AI** that not only speaks to you but also listens, understands, and responds intelligently. Over the past month, I've developed a conversational AI that evolves from a basic prototype into a fully functional voice agent capable of contextual conversations, real-time weather updates, and web searches. Deployed and ready for action!

👽 Meet **ZORION**, your Alien Voice Agent from Andromeda!

-----

## 🤖 About The Project

This project is all about creating a **sophisticated, voice-powered AI agent** that can interact with users through natural voice conversations. It’s powered by the latest AI technologies like Google’s Gemini LLM and integrates multiple APIs for **speech-to-text**, **intelligent responses**, and **text-to-speech**.

**ZORION** has a personality of its own — an alien entity from Andromeda that provides not only practical information (like the weather) but also brings a touch of otherworldly charm to your interactions. The voice agent is designed to understand context and respond intelligently, making each conversation feel more natural and fun.

This repository documents my entire development process, starting from setting up the backend to deploying a fully functional voice agent online. Each day represents a milestone, so you can follow along and see how the project evolves.

### Key Features

- 🎤 **Voice-to-Voice Interaction**: Talk to ZORION and get an immediate, spoken response, giving you a seamless, real-time conversation.
- 🌐 **Contextual Conversations**: ZORION remembers the context of your conversation, allowing for follow-up questions and a more human-like interaction.
- 🤖 **End-to-End AI Pipeline**: Speech-to-Text → Google Gemini → Text-to-Speech, all working together smoothly.
- 🌤 **Weather Updates**: Ask ZORION for the latest weather forecast based on your location or any city.
- 🔍 **Web Search**: ZORION can search the web for the most recent information, making it your personal knowledge assistant.
- 👽 **Alien Persona**: ZORION is not just any assistant; it’s an alien entity from Andromeda with a quirky and fun personality.
- 🖥️ **Modern UI**: A clean, intuitive web interface with a single button to start/stop voice recordings, and visual feedback for different states (e.g., thinking, recording, etc.).
- 🛠️ **Robust Error Handling**: If something goes wrong with the APIs, ZORION has a fallback audio response to keep the conversation flowing.
- 🚀 **Live Deployment**: ZORION is hosted on Render.com and is ready to interact with you online!

-----

## 🛠️ Tech Stack

This project is built using **Python** for the backend and **JavaScript** for the frontend, along with several powerful APIs to handle the core functionalities:

- **Backend**:
  - **FastAPI**: Asynchronous API server, built to handle multiple requests and interactions smoothly.
  - **Uvicorn**: Fast and efficient ASGI server to run the FastAPI app.
  - **Python-Dotenv**: For managing environment variables securely.
  - **WebSockets**: For real-time communication between the server and the client.

- **Frontend**:
  - **HTML, CSS, JavaScript**: For the structure, design, and client-side interactivity.
  - **Bootstrap 5**: For a responsive and user-friendly interface.
  - **MediaRecorder API & WebSocket API**: To record and stream audio from your microphone directly to the server.

- **AI & Voice APIs**:
  - **Murf AI**: For high-quality, natural-sounding **Text-to-Speech (TTS)**, including the ability to stream audio.
  - **AssemblyAI**: To transcribe your voice into text with **Speech-to-Text (STT)** accuracy.
  - **Google Gemini**: Powers the **Large Language Model (LLM)**, enabling intelligent, context-aware responses.
  - **SerpAPI**: Retrieves **real-time search results** from Google to answer questions from the web.
  - **Weather API**: Pulls up-to-date **weather data** for any location you ask about.

- **Deployment**:
  - **Render.com**: Hosting the app and making it publicly accessible for anyone to interact with.

-----

## ⚙️ Architecture

The application is built using a **client-server** architecture, where the frontend runs in the user's browser, capturing audio and handling the UI, while the backend (FastAPI) processes everything behind the scenes. Here’s the flow of how ZORION works:

1. **Client** captures your voice using the **MediaRecorder API** and sends it to the **FastAPI server**.
2. The server processes the audio and sends it to **AssemblyAI** to convert it into text (Speech-to-Text).
3. The **Google Gemini LLM** takes the transcript and generates a context-aware response.
4. The response is sent to **Murf AI** to be converted back into speech (Text-to-Speech).
5. **ZORION** speaks back to you, and the conversation continues.

ZORION also adds the ability to:
- Get real-time **weather information** using the **Weather API**.
- **Search the web** for information using **SerpAPI**.

-----

## 🚀 Getting Started

### Try the Live Agent

ZORION is **live** and ready for interaction! 🌌 You can access the agent here:

**[Live Agent](https://voice-agent-kzw7.onrender.com/)**

To start, click the settings icon to enter your **API keys**, grant microphone permissions, and start chatting with ZORION!

### Running the App Locally

If you'd like to run this on your own machine, follow these steps:

#### Prerequisites

- Python 3.8+
- API keys for:
  - Murf AI
  - AssemblyAI
  - Google Gemini
  - SerpAPI
  - Weather API (for weather functionality)

#### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/kanishkaaa08/voice-agent.git
    ```
2. **Navigate to the appropriate project directory** (e.g., `day-29`):
    ```sh
    cd voice-agent
    ```
3. **Install the required dependencies**:
    ```sh
    pip install -r requirements.txt
    ```
4. **Create a `.env` file** in the root directory with the following API keys:
    ```
    MURF_API_KEY="your_murf_api_key_here"
    ASSEMBLYAI_API_KEY="your_assemblyai_api_key_here"
    GOOGLE_API_KEY="your_google_genai_key_here"
    SERP_API_KEY="your_serp_api_key_here"
    WEATHER_API_KEY="your_weather_api_key_here"
    ```

5. **Run the FastAPI server**:
    ```sh
    uvicorn app:app --reload --port 8000
    ```

6. **Open your browser** and go to `http://localhost:8000`. Grant microphone permissions and start interacting with ZORION!

-----

## 📂 Project Structure

Here’s how the project is structured, based on the alien-inspired theme:

````

AI Voice Agent/
├── app.py           # Main application file handling the backend API
├── Services/        # The brain behind ZORION’s capabilities
│   ├── llm.py       # Handles interactions with Google Gemini LLM
│   ├── stt.py       # Manages real-time speech-to-text
│   └── tts.py       # Manages text-to-speech conversion
├── templates/
│   └── index.html   # Main UI for the voice agent
├── static/
│   ├── script.js    # Frontend logic for recording and settings
│   └── style.css    # UI styles
├── requirements.txt # Lists all project dependencies for deployment
└── .env             # Stores API keys for local development

```

-----

## 🗓️ Project Journey: Day 1 to 29

Here’s a quick summary of the progress I made during the challenge:

- **Day 01**: Laid the foundation with a basic **FastAPI server** and a simple **Bootstrap UI**.
- **Day 02**: Integrated the **Murf AI API** to create the first endpoint for **Text-to-Speech (TTS)**.
- **Day 03**: Built the **frontend interface** to interact with the TTS endpoint, allowing users to type text and hear it spoken.
- **Day 04**: Developed a client-side **Echo Bot** using the **MediaRecorder API** to record and play back user audio.
- **Day 05**: Enhanced the echo bot by implementing **server-side audio upload**, moving from client-only to a client-server model.
- **Day 06**: Integrated the **AssemblyAI API** for **Speech-to-Text (STT)**, allowing the server to transcribe user audio.
- **Day 07**: Created a **voice transformation bot** by chaining the STT and TTS services. The app would listen, transcribe, and speak the user's words back in a different voice.
- **Day 08**: Introduced **intelligence** by integrating the **Google Gemini LLM**, creating an endpoint that could generate text-based responses to queries.
- **Day 09**: Achieved a full **voice-to-voice conversational loop**. The app could now listen to a spoken question and provide a spoken answer generated by the LLM.
- **Day 10**: Implemented **chat history** and **session management**, giving the agent a "memory" to hold context-aware conversations.
- **Day 11**: Made the application more robust by adding **server-side** and **client-side error handling**, including a friendly fallback audio message for API failures.
- **Day 12**: Performed a major **UI revamp**, simplifying the interface to a single, animated record button and a cleaner, more modern aesthetic.
- **Day 13**: Focused on **documentation**, creating a comprehensive `README.md` file to explain the project's architecture, features, and setup.
- **Day 14 - 26**: Continued with foundational work, from setting up the server and integrating AI services to giving the agent a **persona** and **web search capabilities**.
- **Day 27**: Revamped the **UI** and implemented a **settings panel** for API key configuration directly in the browser.
- **Day 28**: Successfully **deployed** the agent to a public cloud server, making it accessible to all.

This project has been an exciting ride! Let me know if you have any questions, and feel free to contribute or explore the code. Enjoy chatting with ZORION! 👽✨
```
