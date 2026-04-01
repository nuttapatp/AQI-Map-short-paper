# AQI Live Map Dashboard

Real-time air quality dashboard built with Next.js and Leaflet.js — displays live AQI readings from all users on an interactive Thailand map, updated via Server-Sent Events.

**Live demo:** [aqi-map-short-paper.onrender.com](https://aqi-map-short-paper.onrender.com)

---

## Features

- **Real-time map** — color-coded markers update live via SSE (no polling)
- **AQI legend** — 6-level color scale (Good → Hazardous)
- **User sidebar** — lists all users with AQI value and status label
- **Auto-reconnect** — SSE hook reconnects automatically on disconnect
- **Dark UI** — clean dark theme built with Tailwind CSS

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Map | Leaflet.js + react-leaflet |
| Data | Server-Sent Events (SSE) |
| Deployment | Render |

---

## AQI Color Scale

| AQI | Level | Color |
|---|---|---|
| 0–50 | Good | Green |
| 51–100 | Moderate | Yellow |
| 101–150 | Unhealthy (Sensitive) | Orange |
| 151–200 | Unhealthy | Red |
| 201–300 | Very Unhealthy | Purple |
| 301+ | Hazardous | Dark Red |

---

## Local Development

```bash
# Install dependencies
npm install

# Set backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8082" > .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend Spring Boot URL (e.g. `https://api-short-paper.onrender.com`) |

---

## Backend

This dashboard connects to [API-Short-paper](../API-Short-paper) via SSE endpoint:
```
GET /api/v1/sse/aqi-stream
```
