#!/bin/bash

# Kill all Python processes (this is extreme but will make sure no conflicts)
echo "Killing any existing Python processes..."
killall -9 python 2>/dev/null || true
killall -9 Python 2>/dev/null || true

echo "========================================"
echo "STARTING SERVER ON PORT 9999"
echo "ACCESS THE SITE AT: http://localhost:9999"
echo "========================================"

# Run app directly with specific port
python app.py 