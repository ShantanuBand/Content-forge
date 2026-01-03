# Use Node 20 (required for Vite 7)
FROM node:20-alpine

WORKDIR /app

# ---------------- BACKEND ----------------
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# ---------------- FRONTEND ----------------
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Cloud Run port
EXPOSE 8080

# Start backend
CMD ["node", "backend/server.js"]
