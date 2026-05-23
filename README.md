# South Sudanese eLearning App

A full-stack eLearning application designed for South Sudanese education, featuring interactive lessons, quizzes, and AI-powered chat support.

## Features

- User authentication and registration
- Browse subjects and chapters
- Interactive video lessons
- Quizzes and assessments
- AI chat assistant for learning support

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB connection string for the backend

### Installation

1. Clone the repository
2. Install dependencies for client and server:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Configure environment variables in `server/.env` or in your deployment platform.
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
4. Start the development servers:

   ```bash
   # Terminal 1: Start backend
   cd server
   npm start

   # Terminal 2: Start frontend
   cd client
   npm start
   ```
## Deployment

- Backend: the root `render.yaml` deploys the API from `server/`.
- The backend uses MongoDB only.
- Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `GMAIL_APP_PASSWORD` in Render environment variables.
- Use the Render service domain `https://ss-elearning-api.onrender.com` for the frontend rewrite.
- Frontend: `vercel.json` rewrites `/api/(.*)` to `https://ss-elearning-api.onrender.com/api/$1`.
- Confirm the deployed backend by visiting `https://ss-elearning-api.onrender.com/` and `https://ss-elearning-api.onrender.com/api/health`.
## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend API
- `database/` - Database schemas and scripts
- `docs/` - Project documentation

## Contributing

Please read the contributing guidelines before making changes.

## License

This project is licensed under the MIT License.