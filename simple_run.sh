#!/bin/bash

# Kill any existing instances
pkill -f "python app.py" 2>/dev/null || true

# Edit the port in app.py to use 5050
sed -i.bak 's/port=[0-9]*/port=5050/' app.py 

echo "Starting server on port 5050..."
echo "Please access the visualization at: http://localhost:5050"

# Run the app
python app.py 