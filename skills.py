# skills.py
import os, requests, datetime as dt
from typing import Dict, Any

# ---------- Weather (Open-Meteo, no key) ----------
def weather_get_current(city: str) -> Dict[str, Any]:
    """
    Return current weather for a city using Open-Meteo.
    """
    if not city or not city.strip():
        raise ValueError("City name is required")

    # 1) Geocode city -> lat/lon
    geo = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": city, "count": 1, "language": "en", "format": "json"},
        timeout=10,
    )
    geo.raise_for_status()
    data = geo.json()
    if not data.get("results"):
        return {"ok": False, "city": city, "error": "City not found"}

    g = data["results"][0]
    lat, lon = g["latitude"], g["longitude"]
    resolved = f'{g["name"]}{", " + g["country_code"] if g.get("country_code") else ""}'

    # 2) Current weather
    w = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "temperature_unit": "celsius",
            "windspeed_unit": "kmh",
        },
        timeout=10,
    )
    w.raise_for_status()
    cj = w.json().get("current_weather") or {}

    return {
        "ok": True,
        "city": resolved,
        "temperature_c": cj.get("temperature"),
        "windspeed_kmh": cj.get("windspeed"),
        "winddirection_deg": cj.get("winddirection"),
        "weathercode": cj.get("weathercode"),
        "time_utc": cj.get("time"),
        "source": "Open-Meteo",
    }

# ---------- Web Search (Tavily) ----------
def web_search(query: str, max_results: int = 3) -> Dict[str, Any]:
    """
    Return quick web search results using Tavily.
    Requires env var TAVILY_API_KEY.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return {"ok": False, "error": "TAVILY_API_KEY not set"}

    resp = requests.post(
        "https://api.tavily.com/search",
        json={"api_key": api_key, "query": query, "max_results": max_results},
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()

    # Normalize to a friendly shape
    hits = []
    for r in (data.get("results") or [])[:max_results]:
        hits.append({
            "title": r.get("title"),
            "url": r.get("url"),
            "content": r.get("content"),
        })

    return {
        "ok": True,
        "query": query,
        "results": hits,
        "source": "Tavily",
        "searched_at": dt.datetime.utcnow().isoformat() + "Z",
    }
