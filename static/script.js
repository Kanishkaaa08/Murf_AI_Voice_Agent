// static/script.js
document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("recordBtn");
    const statusDisplay = document.getElementById("statusDisplay");
    const chatLog = document.getElementById("chat-log");
    const saveKeysBtn = document.getElementById("saveKeysBtn");

    let isRecording = false;
    let ws = null;
    let audioContext;
    let mediaStream;
    let processor;
    let audioQueue = [];
    let isPlaying = false;

    // Load saved API keys
    const loadSettings = () => {
        document.getElementById("murfKey").value = localStorage.getItem("murfApiKey") || "";
        document.getElementById("assemblyKey").value = localStorage.getItem("assemblyAiApiKey") || "";
        document.getElementById("geminiKey").value = localStorage.getItem("geminiApiKey") || "";
        document.getElementById("serpApiKey").value = localStorage.getItem("serpApiKey") || "";
    };
    loadSettings();

    // Save API keys
    saveKeysBtn.addEventListener("click", () => {
        localStorage.setItem("murfApiKey", document.getElementById("murfKey").value);
        localStorage.setItem("assemblyAiApiKey", document.getElementById("assemblyKey").value);
        localStorage.setItem("geminiApiKey", document.getElementById("geminiKey").value);
        localStorage.setItem("serpApiKey", document.getElementById("serpApiKey").value);
        alert("API keys saved!");
    });

    // Add messages to chat
    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = type === "assistant" ? 'message assistant' : 'message user';
        msgDiv.textContent = text;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    // Play audio queue
    const playNextAudio = () => {
        if (audioQueue.length === 0) {
            isPlaying = false;
            return;
        }
        isPlaying = true;
        const base64Audio = audioQueue.shift();
        const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;

        audioContext.decodeAudioData(audioData).then(buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.onended = playNextAudio;
            source.start();
        }).catch(err => {
            console.error("Audio decode error:", err);
            playNextAudio();
        });
    };

    // Start recording
    const startRecording = async () => {
        const apiKeys = {
            murf: localStorage.getItem("murfApiKey"),
            assemblyai: localStorage.getItem("assemblyAiApiKey"),
            gemini: localStorage.getItem("geminiApiKey"),
            serpapi: localStorage.getItem("serpApiKey")
        };

        if (!apiKeys.murf || !apiKeys.assemblyai || !apiKeys.gemini || !apiKeys.serpapi) {
            alert("Please set all API keys in the sidebar.");
            return;
        }

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            await audioContext.resume(); // Important to resume context on user gesture

            const source = audioContext.createMediaStreamSource(mediaStream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                if (!isRecording) return;
                const input = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) {
                    pcmData[i] = Math.max(-1, Math.min(1, input[i])) * 32767;
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(pcmData.buffer);
                }
            };

            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "config", keys: apiKeys }));
                statusDisplay.textContent = "Listening...";
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "assistant") addMessage(msg.text, "assistant");
                if (msg.type === "final") addMessage(msg.text, "user");
                if (msg.type === "audio") {
                    audioQueue.push(msg.b64);
                    if (!isPlaying) playNextAudio();
                }
            };

            ws.onerror = (e) => console.error("WebSocket error:", e);

            isRecording = true;
            recordBtn.classList.add("recording");
        } catch (err) {
            console.error("Recording failed:", err);
            alert("Please allow microphone access to use the voice agent.");
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (processor) processor.disconnect();
        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        if (ws) ws.close();

        isRecording = false;
        recordBtn.classList.remove("recording");
        statusDisplay.textContent = "Ready to chat!";
    };

    // Mic button click
    recordBtn.addEventListener("click", () => {
        if (isRecording) stopRecording();
        else startRecording();
    });
});
