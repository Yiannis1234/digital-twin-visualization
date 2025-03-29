from flask import Flask, render_template, jsonify, request
import random
import numpy as np
import time
from datetime import datetime

app = Flask(__name__)

# Parameters and their impact on digital threads in automotive industry
parameter_impacts = {
    'system_load': {
        'description': 'Processing load across the automotive data management systems',
        'impacts': [
            'Affects real-time data synchronization between stakeholders',
            'High load can cause data loss during critical product lifecycle phases',
            'Impacts traceability continuity across manufacturing stages',
            'Can create bottlenecks in product development and quality control'
        ]
    },
    'network_latency': {
        'description': 'Delay in data transmission between automotive systems and stakeholders',
        'impacts': [
            'Delays in component traceability leading to compliance risks',
            'Affects timely decision-making during recall management',
            'Creates challenges in real-time synchronization of digital thread',
            'Can introduce data inconsistencies between manufacturing partners'
        ]
    },
    'data_throughput': {
        'description': 'Volume of automotive data processed across the digital thread',
        'impacts': [
            'Determines level of detail in product lifecycle management',
            'Affects integration of data from multiple stakeholders',
            'Enables or limits effectiveness of cybersecurity measures',
            'Influences compatibility between different systems in the supply chain'
        ]
    },
    'system_health': {
        'description': 'Overall health indicator of the automotive digital thread infrastructure',
        'impacts': [
            'Represents reliability of data traceability system',
            'Indicates confidence level in data accuracy across lifecycle',
            'Reflects effectiveness of stakeholder cooperation',
            'Determines ability to overcome compatibility and privacy challenges'
        ]
    }
}

# Automotive manufacturing stages for the visualization
manufacturing_stages = [
    "Raw Materials",
    "Component Manufacturing",
    "Sub-Assembly",
    "Final Assembly",
    "Quality Control",
    "Dealership Network"
]

# Generate a history of data points to initialize charts
def generate_initial_data(num_points=20):
    data = {
        'timestamps': [],
        'system_load': [],
        'network_latency': [],
        'data_throughput': [],
        'system_health': []
    }
    
    current_time = time.time()
    for i in range(num_points):
        # System Load fluctuates randomly
        system_load = random.uniform(20, 100)  # in percentage (0-100%)
        
        # Network Latency is influenced by System Load
        network_latency = random.uniform(20, 50) + (system_load * 0.3)  # in ms
        
        # Data Throughput inversely related to System Load and Network Latency
        data_throughput = max(0, 1000 - (system_load * 5) - (network_latency * 2))  # in Mbps
        
        # System Health Index decreases with high load & latency, increases with throughput
        system_health = max(0, 100 - (system_load * 0.4) - (network_latency * 0.2) + (data_throughput * 0.02))  # 0-100%
        
        # Add to data arrays
        timestamp = current_time - (num_points - i) * 1
        data['timestamps'].append(timestamp * 1000)  # Convert to milliseconds for JavaScript
        data['system_load'].append(round(system_load, 2))
        data['network_latency'].append(round(network_latency, 2))
        data['data_throughput'].append(round(data_throughput, 2))
        data['system_health'].append(round(system_health, 2))
    
    return data

# Generate new data point with optional parameter adjustments
def generate_data_point(adjustments=None):
    if adjustments is None:
        adjustments = {}
    
    # Base values
    system_load_base = random.uniform(20, 100)
    
    # Apply adjustments if provided
    system_load = min(100, max(0, system_load_base + adjustments.get('system_load', 0)))
    
    # Calculate dependent values
    network_latency = random.uniform(20, 50) + (system_load * 0.3)  # in ms
    network_latency = min(200, max(0, network_latency + adjustments.get('network_latency', 0)))
    
    data_throughput = max(0, 1000 - (system_load * 5) - (network_latency * 2))  # in Mbps
    data_throughput = min(1000, max(0, data_throughput + adjustments.get('data_throughput', 0)))
    
    # System Health Index calculation
    system_health = max(0, 100 - (system_load * 0.4) - (network_latency * 0.2) + (data_throughput * 0.02))
    system_health = min(100, max(0, system_health + adjustments.get('system_health', 0)))
    
    return {
        'timestamp': time.time() * 1000,  # Current time in milliseconds
        'system_load': round(system_load, 2),
        'network_latency': round(network_latency, 2),
        'data_throughput': round(data_throughput, 2),
        'system_health': round(system_health, 2)
    }

@app.route('/')
def index():
    return render_template('index.html', 
                          parameter_impacts=parameter_impacts,
                          manufacturing_stages=manufacturing_stages)

@app.route('/api/initial-data')
def get_initial_data():
    return jsonify(generate_initial_data())

@app.route('/api/data')
def get_data():
    # Extract adjustments from query parameters if provided
    adjustments = {}
    
    # Check for system_load adjustment
    if 'system_load' in request.args:
        try:
            adjustments['system_load'] = float(request.args.get('system_load', 0))
        except ValueError:
            pass
    
    # Check for network_latency adjustment
    if 'network_latency' in request.args:
        try:
            adjustments['network_latency'] = float(request.args.get('network_latency', 0))
        except ValueError:
            pass
    
    # Check for data_throughput adjustment
    if 'data_throughput' in request.args:
        try:
            adjustments['data_throughput'] = float(request.args.get('data_throughput', 0))
        except ValueError:
            pass
    
    # Generate data with the provided adjustments
    return jsonify(generate_data_point(adjustments))

@app.route('/api/adjust/<parameter>/<value>')
def adjust_parameter(parameter, value):
    try:
        value = float(value)
        adjustments = {parameter: value}
        return jsonify(generate_data_point(adjustments))
    except ValueError:
        return jsonify({'error': 'Invalid value provided'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005) 