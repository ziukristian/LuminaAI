# LuminaAI

## Project Overview

LuminaAI is an open-source project developed for the HackSocial 2025 hackathon, focused on creating solutions for the greater good. This application aims to support mental health by providing users with tools to journal, chat, and generate mental health reports, leveraging AI to enhance user experience and well-being.

### Inspiration

Mental health is a critical aspect of our daily lives, yet many struggle to find accessible support. This project was inspired by the desire to make mental health resources more approachable and interactive, using technology to empower users to track their well-being, communicate, and receive AI-driven insights.

### Tech Stack
- **Backend:** ASP.NET Core Web API (C#)
- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Database:** SQLite
- **AI Integration:** OpenAI API
- **Containerization:** Docker & Docker Compose

## Features
- **Journaling:** Users can create and manage personal journal entries.
- **Chat:** Real-time chat functionality for support and interaction.
- **Mental Health Reports:** Generate reports and insights using AI.
- **Modern UI:** Responsive and visually appealing frontend.

## How to Run the Project

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [PNPM](https://pnpm.io/installation) (or npm/yarn) for frontend dependencies

### 1. Clone the Repository
```powershell
# Clone the repo
git clone https://github.com/ziukristian/LuminaAI.git
cd HackSocial_MentalHealthApp
```

### 2. Run with Docker Compose
```powershell
# Start both backend and frontend services
docker-compose up --build
```
- The backend API will be available at `http://localhost:5000` (or as configured)
- The frontend will be available at `http://localhost:3000`

### 3. Manual Run (Development)
#### Backend
```powershell
cd HackSocial.MentalHealthApp.Api
# Restore and run the API
dotnet restore ; dotnet run
```
#### Frontend
```powershell
cd HackSocial.MentalHealthApp.Frontend
pnpm install ; pnpm dev
```

## Project Structure
- `HackSocial.MentalHealthApp.Api/` — ASP.NET Core backend
- `HackSocial.MentalHealthApp.Frontend/` — Next.js frontend
- `docker-compose.yml` — Multi-service orchestration

## What We Learned
- Integrating AI for mental health insights
- Building full-stack apps with modern frameworks
- Containerizing applications for easy deployment
- Designing user-centric interfaces

### HackSocial 2025
This project was built for the HackSocial hackathon, encouraging solutions that make a real impact in our community. Learn more at [HackSocial](#).
