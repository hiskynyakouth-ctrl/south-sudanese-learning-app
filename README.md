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
- **Database**: SQL (schema provided)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Database (MySQL/PostgreSQL)

### Installation

1. Clone the repository
2. Install dependencies for client and server:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Set up the database using `database/schema.sql`
4. Configure environment variables in `client/.env` and `server/.env`
5. Start the development servers:

   ```bash
   # Terminal 1: Start backend
   cd server
   npm start

   # Terminal 2: Start frontend
   cd client
   npm start
   ```

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend API
- `database/` - Database schemas and scripts
- `docs/` - Project documentation

## Contributing

Please read the contributing guidelines before making changes.

## License

This project is licensed under the MIT License.