let mediaRecorder;
let audioChunks = [];
let sessionId;
let isRecording = false;

// Generate or retrieve session ID from URL
function getSessionId() {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("session_id");
    if (!id) {
        id = crypto.randomUUID();
        params.set("session_id", id);
        window.history.replaceState({}, "", `${location.pathname}?${params}`);
    }
    return id;
}

sessionId = getSessionId();

// DOM elements
const recordBtn = document.getElementById("recordBtn");
const recordLabel = document.getElementById("recordLabel");
const chatArea = document.getElementById("chatContainer");
const hiddenAudio = document.getElementById("hiddenAudio");

// Toggle recording on button click
recordBtn.addEventListener("click", () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            await sendAudioToServer(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        updateRecordButtonUI(true);
    } catch (error) {
        console.error("Error accessing microphone:", error);
        appendMessage("System", "⚠️ Unable to access microphone.");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        isRecording = false;
        updateRecordButtonUI(false);
    }
}

function updateRecordButtonUI(recording) {
    if (recording) {
        recordBtn.classList.add("recording");
        recordLabel.textContent = "Stop Recording";
    } else {
        recordBtn.classList.remove("recording");
        recordLabel.textContent = "Start Recording";
    }
}

function showLoading() {
    document.getElementById("loading").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

async function sendAudioToServer(audioBlob) {
    appendMessage("You", "🎤 (voice message sent)");

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav"); // must be "file" for FastAPI UploadFile
    formData.append("session_id", sessionId);
    showLoading();
    try {
        const response = await fetch(`/agent/chat/${sessionId}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server error: ${errText}`);
        }

        const data = await response.json();

        if (data.text) {
            appendMessage("AI", data.text);
        }

        if (data.audio_url) {
            playAudio(data.audio_url);
        }

    } catch (error) {
        console.error("Error sending audio:", error);
        appendMessage("System", `⚠️ Error: ${error.message}`);
    }
}

function appendMessage(sender, text) {
    const msg = document.createElement("div");

    if (sender === "You") {
        msg.classList.add("user-msg");
    } else if (sender === "AI") {
        msg.classList.add("bot-msg");
    } else {
        msg.classList.add("bot-msg"); // system messages look like AI
    }

    msg.textContent = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}


function playAudio(url) {
    hiddenAudio.src = url;
    hiddenAudio.play().catch(err => {
        console.error("Audio play error:", err);
        appendMessage("System", "⚠️ Could not play audio.");
    });
}
