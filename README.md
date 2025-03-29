# Automotive Digital Thread Visualization System

An interactive web-based visualization tool for exploring digital threads in automotive manufacturing and data traceability.

## Overview

This application provides a real-time visualization of how digital threads connect various stages of the automotive manufacturing process, from raw materials to dealership networks. It allows researchers and professionals to understand the relationships between different parameters affecting data traceability in the automotive industry.

## Features

1. **Interactive Digital Thread Visualization**
   - Visual representation of six key manufacturing stages
   - Real-time data flow particles showing information movement
   - Stakeholder connection points showing integration between systems
   - Cybersecurity elements illustrating data protection points

2. **Real-time Performance Metrics**
   - System Load (%) - Processing capacity across automotive systems
   - Network Latency (ms) - Communication delays between systems
   - Data Throughput (Mbps) - Volume of data processed
   - Traceability Health Index (%) - Overall health of digital threads

3. **Interactive Parameter Controls**
   - Adjustable sliders to modify system parameters
   - Real-time visualization updates based on parameter changes
   - Reset functionality to return to baseline conditions

4. **Educational Information**
   - Detailed explanations of digital threads in automotive manufacturing
   - Parameter impact descriptions for understanding the effects of changes
   - Real-world implications for automotive supply chain operations

## Project Structure

```
digital_twin_visualization/
├── app.py                   # Flask application main file
├── requirements.txt         # Python dependencies
├── README.md                # This documentation
├── static/                  # Static files
│   ├── css/                 # CSS stylesheets
│   │   └── main.css         # Main stylesheet
│   ├── js/                  # JavaScript files
│   │   └── digital-thread.js # Digital thread visualization logic
│   └── images/              # Image assets (if any)
└── templates/               # HTML templates
    └── index.html           # Main application page
```

## Setup and Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd digital_twin_visualization
   ```

2. **Create and activate a virtual environment (optional but recommended)**
   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```
   python app.py
   ```

5. **Access the application**
   Open your web browser and navigate to:
   - http://localhost:5005
   - http://127.0.0.1:5005

## Usage Guide

1. **Observing the Digital Thread**
   - Watch how data flows through the automotive manufacturing stages
   - Observe the relationships between different stakeholders and stages
   - Note how the traceability health affects the overall visualization

2. **Experimenting with Parameters**
   - Use the interactive sliders to adjust system parameters
   - Observe how changes to one parameter affect others
   - Watch for traceability issues that appear when certain thresholds are crossed

3. **Interpreting the Charts**
   - Monitor the real-time charts to see trends developing
   - Compare different parameters to understand their relationships
   - Use the time-series data to identify patterns and correlations

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Chart.js
- **Time Management**: Moment.js

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created for research and educational purposes regarding digital threads in automotive manufacturing
- Designed to illustrate concepts of data traceability, interoperability, and digital continuity 