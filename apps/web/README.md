# CoffeeHub Nepal - Web Frontend

React + TypeScript frontend application for the CoffeeHub Nepal platform.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd apps/web
npm install
```

### Environment Variables

Create a `.env` file in the `apps/web` directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Route-level page components
- `src/services/` - API service functions
- `src/utils/` - Utility functions and constants
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks

## Features

- 🏠 Home dashboard with live prices and AI assistant
- 🛒 Marketplace for coffee and equipment
- 💼 Job board
- 📢 Official notices and alerts
- 💬 Q&A community forum
- 👤 User profile management

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)

