let ws;
let mediaRecorder;
let audioChunks = [];

// Save API keys
document.getElementById("saveKeysBtn").addEventListener("click", async () => {
  const assemblyKey = document.getElementById("assemblyKey").value;
  const geminiKey = document.getElementById("geminiKey").value;
  const murfKey = document.getElementById("murfKey").value;

  const response = await fetch("/set-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assemblyKey, geminiKey, murfKey }),
  });

  const result = await response.json();
  alert(result.message);

  if (result.status === "success") {
    document.querySelectorAll(".skill-btn").forEach(btn => btn.disabled = false);
  }
});

// Setup WebSocket connection
function initWebSocket() {
  ws = new WebSocket(`ws://${window.location.host}/ws`);

  ws.onopen = () => {
    console.log("✅ WebSocket connected");
    document.getElementById("statusDisplay").innerText = "Connected to ZORION...";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "final") {
      addMessage("🗣 You", data.text);
    } else if (data.type === "assistant") {
      addMessage("👽 ZORION", data.text);
    } else if (data.type === "audio") {
      playAudio(data.b64);
    } else if (data.type === "llm") {
      addMessage("⚠️ Error", data.text);
    }
  };

  ws.onclose = () => {
    console.log("❌ WebSocket closed");
    document.getElementById("statusDisplay").innerText = "Connection lost...";
  };
}

// Start/stop recording
document.getElementById("recordBtn").addEventListener("click", async () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    document.getElementById("recordBtn").classList.remove("recording");
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
      event.data.arrayBuffer().then((buffer) => {
        ws.send(buffer);
      });
    }
  };

  mediaRecorder.start(250); // send audio in chunks
  document.getElementById("recordBtn").classList.add("recording");
});

// Play received audio
function playAudio(b64) {
  const audio = new Audio("data:audio/wav;base64," + b64);
  audio.play();
}

// Add message to chat log
function addMessage(sender, text) {
  const chatLog = document.getElementById("chat-log");
  const messageDiv = document.createElement("div");
  messageDiv.className = "chat-message";

  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Expose to window for skill buttons
window.sendMessageToAgent = function (msg) {
  addMessage("🗣 You", msg);
  ws.send(new TextEncoder().encode(msg));
};

// Init
initWebSocket();
