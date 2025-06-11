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

### Installation

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

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

# Start the backend server
uvicorn app:app --reload
```

## Environment Variables

Create a `.env` file in the frontend directory with these variables:

```
VITE_API_URL=http://localhost:8000
```

## Deployment

The frontend is configured for Vercel deployment. The backend requires a Python-compatible hosting service like Heroku, Railway, or a custom server.

## License

[MIT](LICENSE) 