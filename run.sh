#!/bin/bash

# Automotive Digital Thread Visualization System Launch Script

# Check if a virtual environment exists and activate it if present
if [ -d ".venv" ]; then
    echo "Activating virtual environment..."
    source .venv/bin/activate
fi

# Check if dependencies are installed
if [ ! -f "requirements.txt" ]; then
    echo "Error: requirements.txt not found. Please make sure you're in the project directory."
    exit 1
fi

# Kill any existing instances of the app
echo "Stopping any existing instances of the application..."
pkill -f "python app.py" 2>/dev/null || true

# Start the application
echo "Starting Automotive Digital Thread Visualization..."
echo "The visualization will be available at: http://localhost:8080"
python app.py 