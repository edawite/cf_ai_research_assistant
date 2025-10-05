# cf_ai_research_assistant

An AI-powered research assistant built entirely on Cloudflare's edge infrastructure, demonstrating the integration of Workers AI, Durable Objects, and edge computing.

## 🌐 Live Demo

- **Frontend**: [Deploy and add your URL here]
- **API Endpoint**: [Your Worker URL]/api/chat

## 📋 Project Overview

This application showcases a conversational AI assistant that maintains conversation history and provides contextual responses. Built as a submission for the Cloudflare AI assignment.

### Requirements Met

✅ **LLM**: Llama 3.3 (70B) via Cloudflare Workers AI  
✅ **Workflow/Coordination**: Cloudflare Workers + Durable Objects  
✅ **User Input**: React-based chat interface via Cloudflare Pages  
✅ **Memory/State**: Persistent conversation history in Durable Objects  

## 🏗️ Architecture
User Interface (React)
↓
Cloudflare Pages
↓
Cloudflare Worker (API Handler)
↓
┌───┴───┐
↓       ↓
Durable   Workers AI
Object    (Llama 3.3)
(State)

### Key Components

1. **Frontend (React + Tailwind CSS)**
   - Modern chat interface
   - Real-time message updates
   - Session management
   - Responsive design

2. **Cloudflare Worker**
   - API request routing
   - CORS handling
   - Coordinates between Durable Objects and AI
   - Error handling and logging

3. **Durable Object (ChatSession)**
   - Stores conversation history per session
   - Implements sliding window (20 messages stored, 6 sent to LLM)
   - Provides strong consistency for chat state
   - Isolated per-session state management

4. **Workers AI Integration**
   - Uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast` model
   - Configured for conversational responses
   - Temperature: 0.7 for balanced creativity
   - Max tokens: 512 for concise responses

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account ([sign up here](https://dash.cloudflare.com/sign-up))
- Wrangler CLI: `npm install -g wrangler`

### Backend Deployment
`bash
# Clone the repository
git clone https://github.com/edawite/cf_ai_research_assistant.git
cd cf_ai_research_assistant

# Login to Cloudflare
wrangler login

# Deploy the Worker
wrangler deploy
