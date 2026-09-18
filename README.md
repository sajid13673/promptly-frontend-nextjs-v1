# Promptly Frontend (Next.js v1)

**Promptly** is a simple AI chat and text-generation application that allows users to interact with AI through a clean and responsive chat interface.

This repository contains the **Next.js frontend** for Promptly v1. It communicates with the Laravel backend API for authentication, conversations, and AI-related functionality. It also integrates with a dedicated transcription service to support voice input in the chat.

## ✨ Features

* 💬 AI-powered chat interface
* 📝 Text-based prompt input
* 🎙️ Voice input with audio recording
* 🌊 Audio waveform animation while recording
* 🤖 Automatic voice-to-text transcription
* 🔐 User authentication
* 💭 Conversation and chat history
* 📱 Responsive design for desktop and mobile
* ⚡ Fast and modern Next.js App Router architecture
* 🔗 Integration with Laravel REST API
* 🎯 Type-safe development with TypeScript

## 🛠️ Tech Stack

* **Next.js**
* **TypeScript**
* **Tailwind CSS**
* **Axios**
* **TanStack Query**
* **Heroicons**
* **Framer Motion**

### Related Services

Promptly consists of multiple services:

* **Frontend:** Next.js
* **Backend API:** Laravel
* **Transcription API:** Python + FastAPI + Faster-Whisper

## 📁 Related Repositories

| Repository                                                                     | Description                                                                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [Promptly Frontend](https://github.com/sajid13673/promptly-frontend-nextjs-v1) | Next.js frontend for the Promptly application                                                   |
| [Promptly Backend](https://github.com/sajid13673/promptly-backend-laravel-v1)                                                           | Laravel API responsible for authentication, conversations, AI integration, and application data |
| [Promptly Whisper API](https://github.com/sajid13673/promptly-whishper-api-v1)                                                       | FastAPI service responsible for converting recorded voice/audio into text                       |

> Make sure the backend API and transcription service are configured and running when testing the complete application locally.

## ⚡ Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) 18+
* npm, yarn, pnpm, or bun
* Promptly Laravel backend
* Promptly transcription API *(required for voice input)*

### Installation

Clone the repository:

```bash
git clone https://github.com/sajid13673/promptly-frontend-nextjs-v1.git

cd promptly-frontend-nextjs-v1
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configure the required environment variables in `.env.local`.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_TRANSCRIBER_API_URL=http://localhost:8001
```

> Use the actual ports and URLs configured for your Laravel API and transcription service.

### Run the Development Server

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## 🎙️ Voice Input

Promptly supports voice input in the chat interface.

The frontend:

1. Requests microphone access from the user.
2. Records the user's voice.
3. Displays a visual audio waveform while recording.
4. Sends the recorded audio to the transcription API.
5. Receives the transcribed text.
6. Places the transcription into the chat input.
7. Allows the user to edit or submit the generated text.

The current transcription functionality supports **English voice input**.

## 🔗 Application Architecture

```text
                    ┌──────────────────────┐
                    │   Promptly Frontend  │
                    │      Next.js         │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
          ┌──────────────────┐   ┌─────────────────────┐
          │  Laravel Backend │   │  Whisper Transcriber│
          │       API        │   │     FastAPI         │
          └────────┬─────────┘   └──────────┬──────────┘
                   │                        │
                   ▼                        ▼
             Application                Speech-to-Text
                Data                    Processing
```

## 📂 Project Structure

The project follows the Next.js App Router structure.

```text
src/
├── app/
│   ├── (auth)/
│   ├── (chat)/
│   └── ...
├── components/
├── hooks/
├── lib/
├── services/
└── ...
```

The exact structure may evolve as new features are added.

## 🔐 Environment Variables

Environment-specific configuration should be stored in `.env.local`.

Do not commit `.env.local` or other files containing sensitive credentials.

Example:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_TRANSCRIBER_API_URL=
```

## 🚀 Production

The frontend can be deployed to platforms such as [Vercel](https://vercel.com/).

Before deploying, make sure:

* The Laravel API is accessible from the deployed frontend.
* The transcription API is accessible from the deployed frontend.
* Production environment variables are configured.
* CORS is correctly configured on the backend services.
* HTTPS is enabled for production endpoints.

## 📌 Project Status

Promptly v1 is an ongoing personal project focused on building an AI chat application while exploring modern web technologies, API integration, and voice-based interaction.

## 📄 License

This project is for personal/learning purposes.
