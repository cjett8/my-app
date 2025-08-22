# My Survey App

A simple Node.js + Express survey web app that serves a multi-question form on `http://localhost:4000`.

## Features
- Multi-step survey with 10 questions.
- "Next" button navigation between questions.
- Final submission only happens at the last question.
- Labels and options properly aligned for readability.
- Built with Node.js and Express.
- Data saved to local PostgreSQL table

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm (comes with Node.js)
- PostgreSQL

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/cjett8/my-app.git
   cd my-survey-app

2. Install dependencies:
- npm install

3. Running the App:
- node server.js

4. File Structure
- server.js – Entry point, sets up Express server.
- public/ – Static assets (HTML, CSS, images).
- src/ – App logic and survey script.
- package.json – Project metadata and dependencies.
- README.md – Documentation.

5. Future Improvements
- Add authentication for respondents.
- Improve styling and responsiveness.
