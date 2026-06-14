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
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL running locally or a remote connection URL

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
   - `DATABASE_URL` or local Postgres settings: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
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
- The backend uses PostgreSQL in this repository.
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
