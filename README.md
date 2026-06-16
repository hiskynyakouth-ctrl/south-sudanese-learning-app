# South Sudanese eLearning App

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
- MongoDB running locally or a remote MongoDB connection URL

### Installation

1. Clone the repository
2. Install dependencies for client and server:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Configure environment variables in `server/.env` or in your deployment platform:
   - `PORT` (optional, defaults to `5051`)
   - `MONGO_URI` (MongoDB connection string), or `DATABASE_URL` / `MONGODB_URI` can be used as aliases
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `GMAIL_USER` and `GMAIL_APP_PASSWORD`, or `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE` (optional)
   - `TEXTBELT_KEY` (optional paid fallback for SMS)

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
- The backend uses MongoDB. Set `MONGO_URI` on Render to your MongoDB Atlas or remote connection string, or use `DATABASE_URL` / `MONGODB_URI` as aliases.
- For email delivery, configure `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Render or `SMTP_*` variables.
- For SMS delivery, configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE`, or set a paid `TEXTBELT_KEY`.
- Frontend: `vercel.json` rewrites `/api/(.*)` to `https://ss-elearning-api.onrender.com/api/$1`.

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend API
- `database/` - Database schemas and scripts
- `docs/` - Project documentation

## Contributing

Please read the contributing guidelines before making changes.

## License

This project is licensed under the MIT License.
