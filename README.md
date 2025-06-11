# Guaco

A personalized recipe recommendation and meal planning application designed to help users create delicious meals from the ingredients they have on hand.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router
- **Backend**: FastAPI (Python)

## Features

- Generate recipes based on available ingredients
- Browse and save recipes by category
- Track nutrition information
- Create and manage grocery lists
- User profile with customization options

## Screenshots

(Coming soon)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.10+
- npm or yarn
- OpenAI API key (for recipe generation)

### Installation

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file for environment variables
cp .env.example .env
# Edit the .env file with your values

# Start the development server
npm run dev
```

#### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Start the backend server
uvicorn app:app --reload
```

## Environment Variables

### Frontend

Create a `.env` file in the frontend directory with these variables:

```
VITE_API_URL=http://localhost:8000
```

### Backend

Create a `.env` file in the backend directory with these variables:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**IMPORTANT:** Never commit your API keys to Git. The `.env` files are included in `.gitignore` to prevent accidentally exposing sensitive information.

## Deployment

### Frontend

The frontend is configured for Vercel deployment. You can deploy directly from GitHub.

### Backend

The backend requires a Python-compatible hosting service like Heroku, Railway, or a custom server. Make sure to set the `OPENAI_API_KEY` environment variable in your hosting service's configuration.

### Environment Variables for Production

For Vercel deployment, add the following environment variables in the Vercel dashboard:
- `VITE_API_URL`: URL of your deployed backend API

For backend deployment, add:
- `OPENAI_API_KEY`: Your OpenAI API key

## License

[MIT](LICENSE) 