// static/script.js
document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("recordBtn");
    const statusDisplay = document.getElementById("statusDisplay");
    const chatLog = document.getElementById('chat-log');

    let isRecording = false;
    let ws = null;
    let audioContext;
    let mediaStream;
    let processor;
    let audioQueue = [];
    let isPlaying = false;

    const addOrUpdateMessage = (text, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-bubble ${type === "assistant" ? "agent" : "user"}`;
        messageDiv.textContent = text;
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const playNextInQueue = () => {
        if (audioQueue.length > 0) {
            isPlaying = true;
            const base64Audio = audioQueue.shift();
            const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
            
            audioContext.decodeAudioData(audioData).then(buffer => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.onended = playNextInQueue;
                source.start();
            }).catch(e => {
                console.error("Error decoding audio data:", e);
                playNextInQueue();
            });
        } else {
            isPlaying = false;
        }
    };

    const startRecording = async () => {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

            const source = audioContext.createMediaStreamSource(mediaStream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);
            source.connect(processor);
            processor.connect(audioContext.destination);
            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(pcmData.buffer);
                }
            };

            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "assistant") {
                    addOrUpdateMessage(msg.text, "assistant");
                } else if (msg.type === "final") {
                    addOrUpdateMessage(msg.text, "user");
                } else if (msg.type === "audio") {
                    audioQueue.push(msg.b64);
                    if (!isPlaying) {
                        playNextInQueue();
                    }
                }
            };

            isRecording = true;
            recordBtn.classList.add("recording");
            statusDisplay.textContent = "Listening...";
        } catch (error) {
            console.error("Could not start recording:", error);
            alert("Microphone access is required to use the voice agent.");
        }
    };

    const stopRecording = () => {
        if (processor) processor.disconnect();
        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        if (ws) ws.close();
        
        isRecording = false;
        recordBtn.classList.remove("recording");
        statusDisplay.textContent = "Ready to chat!";
    };

    recordBtn.addEventListener("click", () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    /**
     * 🔥 New function: Send a manual message (from skill buttons / text input)
     */
    window.sendMessageToAgent = (msg) => {
        if (!msg || msg.trim() === "") return;

        // Show user's message
        addOrUpdateMessage(msg, "user");

        // Ensure websocket exists
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);
            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "text", text: msg }));
            };
        } else {
            ws.send(JSON.stringify({ type: "text", text: msg }));
        }
    };
});
