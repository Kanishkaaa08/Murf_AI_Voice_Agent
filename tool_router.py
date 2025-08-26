# tool_router.py
import google.generativeai as genai
from typing import Dict, Any
from skills import weather_get_current, web_search

# ---- Configure Gemini (expects GOOGLE_API_KEY in env) ----
# import os
# genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# 1) Declare functions ("tools") to Gemini
TOOLS = [{
    "function_declarations": [
        {
            "name": "weather_get_current",
            "description": "Get the current weather for a given city (Celsius, wind).",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "city": {"type": "STRING", "description": "City name, e.g., 'Bengaluru'"},
                },
                "required": ["city"],
            },
        },
        {
            "name": "web_search",
            "description": "Search the web for latest information; returns a few top results.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "query": {"type": "STRING", "description": "Search query"},
                    "max_results": {"type": "NUMBER", "description": "Number of results (1-5)"},
                },
                "required": ["query"],
            },
        },
    ]
}]

SYSTEM_PROMPT = (
    "You are ZORION, a friendly real-time voice agent. "
    "If the user asks about weather or to look something up, "
    "use the appropriate tool. Keep answers concise and spoken-friendly."
)

# 2) Map tool call -> local function
def _run_local_tool(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    if name == "weather_get_current":
        return weather_get_current(args.get("city", ""))
    if name == "web_search":
        return web_search(args.get("query", ""), int(args.get("max_results", 3)))
    return {"ok": False, "error": f"Unknown tool: {name}"}

# 3) One-call helper (non-streaming) for text -> text with tools
def respond_with_tools(user_text: str, model_name: str = "gemini-1.5-pro") -> str:
    model = genai.GenerativeModel(model_name, tools=TOOLS, system_instruction=SYSTEM_PROMPT)

    # Start a session; let Gemini decide if/when to call a tool
    chat = model.start_chat()
    resp = chat.send_message(user_text)

    # If the model requested tool calls, execute and return results to the model
    while True:
        # Gather tool calls (if any)
        tool_calls = []
        for cand in (resp.candidates or []):
            for part in (cand.content.parts or []):
                if getattr(part, "function_call", None):
                    tool_calls.append(part.function_call)

        if not tool_calls:
            # No tool call -> we have a final answer
            return resp.text.strip()

        # Execute each tool call and send tool responses back
        tool_outputs = []
        for call in tool_calls:
            name = call.name
            args = {k: v for k, v in call.args.items()} if getattr(call, "args", None) else {}
            result = _run_local_tool(name, args)
            tool_outputs.append({
                "function_response": {
                    "name": name,
                    "response": result
                }
            })

        # Return the tool results; Gemini will synthesize a natural reply
        resp = chat.send_message(tool_outputs)
