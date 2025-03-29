/**
 * Automotive Digital Thread Visualization
 * Main JavaScript file for handling digital thread visualization and chart interactions
 */

// Manufacturing stages and descriptions
const manufacturingStages = [
    "Raw Materials", 
    "Component Manufacturing", 
    "Sub-Assembly", 
    "Final Assembly", 
    "Quality Control", 
    "Dealership Network"
];

const stageDescriptions = {
    "Raw Materials": "Sourcing and validation of raw materials with full traceability data",
    "Component Manufacturing": "Production of individual components with embedded tracking data",
    "Sub-Assembly": "Assembly of component groups with process validation data",
    "Final Assembly": "Complete vehicle assembly with integrated system data",
    "Quality Control": "Multi-point quality inspection with test results data",
    "Dealership Network": "Vehicle delivery and maintenance history tracking"
};

// Chart objects
let systemLoadChart, networkLatencyChart, dataThroughputChart, systemHealthChart;

// Initialize all charts with initial data
function initializeCharts(initialData) {
    // Helper function to ensure we have arrays for the chart initialization
    function ensureArray(value) {
        return Array.isArray(value) ? value : [value];
    }
    
    // Initialize charts with data arrays or single values
    systemLoadChart = createChart('systemLoadChart', 'System Load', 'rgb(255, 99, 132)', ensureArray(initialData.system_load));
    networkLatencyChart = createChart('networkLatencyChart', 'Network Latency', 'rgb(54, 162, 235)', ensureArray(initialData.network_latency));
    dataThroughputChart = createChart('dataThroughputChart', 'Data Throughput', 'rgb(75, 192, 192)', ensureArray(initialData.data_throughput));
    systemHealthChart = createChart('systemHealthChart', 'Traceability Health', 'rgb(255, 205, 86)', ensureArray(initialData.system_health));
    
    // If we have timestamps, add them to the charts
    if (initialData.timestamps && initialData.timestamps.length > 0) {
        for (let i = 0; i < initialData.timestamps.length; i++) {
            const timestamp = new Date(initialData.timestamps[i]);
            if (i < ensureArray(initialData.system_load).length) {
                addDataToChart(systemLoadChart, timestamp, ensureArray(initialData.system_load)[i]);
            }
            if (i < ensureArray(initialData.network_latency).length) {
                addDataToChart(networkLatencyChart, timestamp, ensureArray(initialData.network_latency)[i]);
            }
            if (i < ensureArray(initialData.data_throughput).length) {
                addDataToChart(dataThroughputChart, timestamp, ensureArray(initialData.data_throughput)[i]);
            }
            if (i < ensureArray(initialData.system_health).length) {
                addDataToChart(systemHealthChart, timestamp, ensureArray(initialData.system_health)[i]);
            }
        }
    }
}

// Add data point to a chart
function addDataToChart(chart, label, value) {
    if (!chart || !chart.data) {
        console.error('Chart not properly initialized');
        return;
    }
    
    // Make sure label is a Date object
    const timestamp = label instanceof Date ? label : new Date(label);
    
    // Add new data
    chart.data.labels.push(timestamp);
    chart.data.datasets[0].data.push(value);
    
    // Remove old data if we have too many points
    // Keep more points to show a longer history with the new time scale
    if (chart.data.labels.length > 30) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    // Update the chart with animation disabled for better performance
    try {
        chart.update('none');
    } catch (e) {
        console.error('Error updating chart:', e);
    }
}

// Chart configuration
function createChart(canvasId, label, color, initialValues) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: color.replace(')', ', 0.15)').replace('rgb', 'rgba'),
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm',
                            second: 'HH:mm:ss'
                        },
                        tooltipFormat: 'HH:mm:ss'
                    },
                    title: {
                        display: true,
                        text: 'Time',
                        size: 14,
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.15)'
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        padding: 8,
                        callback: function(value, index, values) {
                            const date = new Date(value);
                            const hours = date.getHours().toString().padStart(2, '0');
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            return `${hours}:${minutes}`;
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value',
                        size: 14,
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.15)'
                    },
                    ticks: {
                        padding: 8,
                        font: {
                            size: 12
                        },
                        stepSize: function(context) {
                            // Determine appropriate step size based on chart type
                            if (canvasId === 'networkLatencyChart') {
                                return 20; // 20ms steps for latency
                            } else if (canvasId === 'dataThroughputChart') {
                                return 100; // 100Mbps steps for throughput
                            } else {
                                return 10; // 10% steps for others
                            }
                        },
                        callback: function(value, index, values) {
                            // Add appropriate units to tick labels
                            if (canvasId === 'networkLatencyChart') {
                                return value + 'ms';
                            } else if (canvasId === 'dataThroughputChart') {
                                return value + 'Mbps';
                            } else {
                                return value + '%';
                            }
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            
                            // Add appropriate units
                            if (canvasId === 'networkLatencyChart') {
                                label += 'ms';
                            } else if (canvasId === 'dataThroughputChart') {
                                label += 'Mbps';
                            } else {
                                label += '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Poll for data updates
function pollData() {
    // Generate dummy data instead of fetching
    const data = generateDummyData();
    
    // Get current timestamp for all charts
    const timestamp = new Date();
    
    // Update each chart with the new data
    addDataToChart(systemLoadChart, timestamp, data.system_load);
    addDataToChart(networkLatencyChart, timestamp, data.network_latency);
    addDataToChart(dataThroughputChart, timestamp, data.data_throughput);
    addDataToChart(systemHealthChart, timestamp, data.system_health);
    
    // Update digital thread visualization
    updateDigitalThread(data);
    
    // Schedule the next poll
    setTimeout(pollData, 1000); // Poll every 1 second to show real-time updates
}

// Generate random dummy data
function generateDummyData() {
    // Base values with some randomness
    const systemLoad = Math.min(100, Math.max(20, 50 + (Math.random() * 40 - 20)));
    const networkLatency = Math.min(150, Math.max(20, 60 + (Math.random() * 40 - 20)));
    const dataThroughput = Math.min(1000, Math.max(50, 500 + (Math.random() * 200 - 100)));
    
    // System Health calculation
    const systemHealth = Math.min(100, Math.max(0, 
        100 - (systemLoad * 0.4) - (networkLatency * 0.2) + (dataThroughput * 0.02)
    ));
    
    return {
        system_load: systemLoad,
        network_latency: networkLatency,
        data_throughput: dataThroughput,
        system_health: systemHealth
    };
}

// Initialize digital thread visualization
function initializeDigitalThread() {
    const container = document.getElementById('digital-thread-container');
    
    // Create manufacturing stages
    const stageElements = [];
    
    for (let i = 0; i < manufacturingStages.length; i++) {
        const stageName = manufacturingStages[i];
        
        const stage = document.createElement('div');
        stage.className = 'manufacturing-stage';
        stage.id = `stage-${i}`;
        stage.innerHTML = stageName;
        stage.title = stageDescriptions[stageName]; // Add tooltip with description
        
        // Add alert indicator
        const alert = document.createElement('div');
        alert.className = 'stage-alert';
        alert.textContent = '!';
        stage.appendChild(alert);
        
        container.appendChild(stage);
        stageElements.push(stage);
    }
    
    // Position the stages evenly in a horizontal line
    positionStages();
    
    // Create flow path
    const flowPath = document.querySelector('.flow-path');
    flowPath.style.top = '50%';
    flowPath.style.transform = 'translateY(-50%)';
    
    // Create data flow elements
    createDataFlowElements();
    
    // Create stakeholder interactions
    createStakeholderInteractions();
}

function positionStages() {
    const container = document.getElementById('digital-thread-container');
    const stages = document.querySelectorAll('.manufacturing-stage');
    const containerWidth = container.offsetWidth;
    const stageWidth = 120; // Match CSS width
    
    // Calculate the total width needed
    const totalWidth = stages.length * stageWidth;
    const margin = (containerWidth - totalWidth) / (stages.length + 1);
    
    stages.forEach((stage, index) => {
        const leftPos = margin + (index * (stageWidth + margin));
        stage.style.left = `${leftPos}px`;
        stage.style.top = '50%';
        stage.style.transform = 'translateY(-50%)';
    });
}

// Handle window resize to reposition stages
window.addEventListener('resize', function() {
    positionStages();
});

function createDataFlowElements() {
    const container = document.getElementById('digital-thread-container');
    // Clear any existing flow elements
    const existingFlows = container.querySelectorAll('.data-flow');
    existingFlows.forEach(flow => flow.remove());
    
    // Add new flow elements
    for (let i = 0; i < 12; i++) {
        const flow = document.createElement('div');
        flow.className = 'data-flow';
        
        // Position along the flow path
        randomizeFlowPosition(flow);
        
        // Random animation duration to stagger the movement
        const baseSpeed = 10; // seconds to cross the screen
        flow.style.animationDuration = `${baseSpeed + (Math.random() * 5)}s`;
        
        // Random starting position
        flow.style.animationDelay = `-${Math.random() * baseSpeed}s`;
        
        container.appendChild(flow);
    }
}

function randomizeFlowPosition(flowElement) {
    // Vertical position along the flow path with small variation
    const y = 50 + (Math.random() * 4 - 2); // 48% to 52%
    flowElement.style.left = '0';
    flowElement.style.top = `${y}%`;
}

function createStakeholderInteractions() {
    const container = document.getElementById('digital-thread-container');
    // Clear existing stakeholder elements
    const existingStakeholders = container.querySelectorAll('.stakeholder-interaction');
    existingStakeholders.forEach(el => el.remove());
    
    // Add stakeholder interaction points with more meaningful positions
    const stakeholderTypes = ["Supplier", "Engineering", "Manufacturing", "Quality Control", "Dealer"];
    const stakeholderPositions = [
        { x: 15, y: 30 },  // Supplier - near Raw Materials
        { x: 35, y: 20 },  // Engineering - near Component Manufacturing
        { x: 55, y: 25 },  // Manufacturing - near Sub-Assembly
        { x: 75, y: 20 },  // Quality Control - near Quality Control stage
        { x: 90, y: 30 }   // Dealer - near Dealership Network
    ];
    
    for (let i = 0; i < stakeholderTypes.length; i++) {
        const interaction = document.createElement('div');
        interaction.className = 'stakeholder-interaction';
        
        interaction.style.left = `${stakeholderPositions[i].x}%`;
        interaction.style.top = `${stakeholderPositions[i].y}%`;
        
        // Add label
        const label = document.createElement('div');
        label.className = 'stakeholder-label';
        label.textContent = stakeholderTypes[i];
        interaction.appendChild(label);
        
        // Pulsating animation
        interaction.style.animation = 'pulse 3s infinite';
        interaction.style.animationDelay = `${i * 0.5}s`;
        
        // Add tooltip with stakeholder type
        interaction.title = `${stakeholderTypes[i]} Data Integration Point`;
        
        container.appendChild(interaction);
    }
    
    // Add cybersecurity elements
    addCybersecurityElements();
    
    // Create connections between stakeholders and stages
    setTimeout(createStakeholderConnections, 100); // Wait for elements to be positioned
}

function addCybersecurityElements() {
    const container = document.getElementById('digital-thread-container');
    // Clear existing security elements
    const existingShields = container.querySelectorAll('.cybersecurity-shield');
    existingShields.forEach(el => el.remove());
    
    // Add 3 cybersecurity shields at strategic points
    const shieldPositions = [
        { x: 20, y: 70 },
        { x: 50, y: 70 },
        { x: 80, y: 70 }
    ];
    
    for (let i = 0; i < 3; i++) {
        const shield = document.createElement('div');
        shield.className = 'cybersecurity-shield';
        
        shield.style.left = `${shieldPositions[i].x}%`;
        shield.style.top = `${shieldPositions[i].y}%`;
        shield.title = "Cybersecurity Protection";
        
        container.appendChild(shield);
    }
}

function createStakeholderConnections() {
    const container = document.getElementById('digital-thread-container');
    // Clear existing connections
    const existingConnections = container.querySelectorAll('.stakeholder-connection');
    existingConnections.forEach(el => el.remove());
    
    const stakeholders = container.querySelectorAll('.stakeholder-interaction');
    const stageMap = {
        "Supplier": 0,              // Connect Supplier to Raw Materials
        "Engineering": 1,           // Connect Engineering to Component Manufacturing
        "Manufacturing": 2,         // Connect Manufacturing to Sub-Assembly
        "Quality Control": 4,       // Connect Quality Control to Quality Control
        "Dealer": 5                 // Connect Dealer to Dealership Network
    };
    
    // Connect each stakeholder to the corresponding stage
    stakeholders.forEach((stakeholder, index) => {
        const label = stakeholder.querySelector('.stakeholder-label');
        const stakeholderType = label ? label.textContent : '';
        const stageIndex = stageMap[stakeholderType] || Math.min(index, manufacturingStages.length - 1);
        
        const stage = document.getElementById(`stage-${stageIndex}`);
        if (stage) {
            createConnection(stakeholder, stage, container);
        }
    });
}

function createConnection(element1, element2, container) {
    // Get element positions
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate positions relative to container
    const x1 = rect1.left - containerRect.left + (rect1.width / 2);
    const y1 = rect1.top - containerRect.top + (rect1.height / 2);
    const x2 = rect2.left - containerRect.left + (rect2.width / 2);
    const y2 = rect2.top - containerRect.top + (rect2.height / 2);
    
    // Create connection line
    const connection = document.createElement('div');
    connection.className = 'stakeholder-connection';
    
    // Position at start point
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    
    // Calculate length and angle
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
    // Set length and rotation
    connection.style.width = `${length}px`;
    connection.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(connection);
}

// Update digital thread visualization based on current data
function updateDigitalThread(data) {
    // Ensure we have single values, not arrays
    const systemLoad = Array.isArray(data.system_load) ? data.system_load[0] : data.system_load;
    const systemHealth = Array.isArray(data.system_health) ? data.system_health[0] : data.system_health;
    const networkLatency = Array.isArray(data.network_latency) ? data.network_latency[0] : data.network_latency;
    const dataThroughput = Array.isArray(data.data_throughput) ? data.data_throughput[0] : data.data_throughput;
    
    // Update stages based on system health and load
    const numStages = manufacturingStages.length;
    const healthFactor = systemHealth / 100;
    const loadFactor = systemLoad / 100;
    const latencyFactor = Math.max(0, 1 - (networkLatency / 200));
    const throughputFactor = dataThroughput / 1000;
    
    // For each stage, apply visual effects based on parameters
    for (let i = 0; i < numStages; i++) {
        const stage = document.getElementById(`stage-${i}`);
        if (!stage) continue; // Skip if stage not found
        
        const alert = stage.querySelector('.stage-alert');
        
        // Stage border color - more red with higher load
        const loadColor = Math.round(loadFactor * 255);
        stage.style.borderColor = `rgb(${Math.min(13 + loadColor, 255)}, ${Math.max(71 - loadColor, 20)}, ${Math.max(161 - loadColor, 50)})`;
        
        // Show alert indicators for stages with low health or high latency
        if ((i > 0 && healthFactor < 0.6) || (loadFactor > 0.8 && i < numStages - 1)) {
            alert.style.display = 'flex';
            stage.style.borderWidth = '3px';
        } else {
            alert.style.display = 'none';
            stage.style.borderWidth = '2px';
        }
    }
    
    // Update flow path color based on throughput
    const flowPath = document.querySelector('.flow-path');
    if (flowPath) {
        const opacity = 0.4 + (throughputFactor * 0.4);
        flowPath.style.backgroundColor = `rgba(54, 162, 235, ${opacity})`;
        flowPath.style.height = `${2 + (throughputFactor * 3)}px`;
    }
    
    // Update flow elements - adjust count and speed based on throughput
    const container = document.getElementById('digital-thread-container');
    if (!container) return;
    
    const existingFlows = container.querySelectorAll('.data-flow');
    const targetFlowCount = Math.floor(3 + (throughputFactor * 15));
    
    // Remove or add flow elements to match the target count
    if (existingFlows.length > targetFlowCount) {
        // Remove excess flow elements
        for (let i = existingFlows.length - 1; i >= targetFlowCount; i--) {
            if (existingFlows[i]) {
                existingFlows[i].remove();
            }
        }
    } else if (existingFlows.length < targetFlowCount) {
        // Add more flow elements
        for (let i = existingFlows.length; i < targetFlowCount; i++) {
            const flow = document.createElement('div');
            flow.className = 'data-flow';
            randomizeFlowPosition(flow);
            
            // Speed based on latency - lower latency = faster flow
            const speedFactor = 1 + (1 - latencyFactor);
            const baseSpeed = 10 / speedFactor; // Base speed adjusted by latency
            flow.style.animationDuration = `${baseSpeed + (Math.random() * 3)}s`;
            flow.style.animationDelay = `-${Math.random() * baseSpeed}s`;
            
            // Size based on throughput
            const size = 6 + (throughputFactor * 4);
            flow.style.width = `${size}px`;
            flow.style.height = `${size}px`;
            
            container.appendChild(flow);
        }
    }
    
    // Update existing flow elements
    existingFlows.forEach(flow => {
        // Adjust size based on throughput
        const size = 6 + (throughputFactor * 4);
        flow.style.width = `${size}px`;
        flow.style.height = `${size}px`;
        
        // Adjust speed based on latency
        const speedFactor = 1 + (1 - latencyFactor);
        const baseSpeed = 8 / speedFactor;
        flow.style.animationDuration = `${baseSpeed + (Math.random() * 4)}s`;
    });
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the page with charts
    if (document.getElementById('systemLoadChart')) {
        // Use hardcoded initial data instead of fetch
        console.log('Loading charts with static initial data');
        const initialData = {
            system_load: [50, 45, 55, 60, 58],
            network_latency: [60, 65, 70, 65, 62],
            data_throughput: [500, 480, 460, 490, 510],
            system_health: [80, 79, 76, 75, 78],
            timestamps: [
                new Date(Date.now() - 40000),
                new Date(Date.now() - 30000),
                new Date(Date.now() - 20000),
                new Date(Date.now() - 10000),
                new Date()
            ]
        };
        
        // Initialize charts and visualizations with static data
        initializeCharts(initialData);
        initializeDigitalThread();
        updateDigitalThread({
            system_load: 50,
            network_latency: 60,
            data_throughput: 500,
            system_health: 80
        });
        
        // Start polling for data
        pollData();
        
        // Set up event listeners for sliders
        const sliders = document.querySelectorAll('.form-range');
        sliders.forEach(slider => {
            slider.addEventListener('input', function() {
                // Instead of fetching, generate data biased by slider values
                handleSliderAdjustment();
            });
        });
        
        // Set up reset button
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Reset all sliders to default values
                document.getElementById('systemLoadSlider').value = 50;
                document.getElementById('networkLatencySlider').value = 60;
                document.getElementById('dataThroughputSlider').value = 500;
                
                // Update displayed values
                document.getElementById('systemLoadValue').textContent = '50%';
                document.getElementById('networkLatencyValue').textContent = '60ms';
                document.getElementById('dataThroughputValue').textContent = '500Mbps';
                
                // Generate data with reset values
                const data = {
                    system_load: 50,
                    network_latency: 60,
                    data_throughput: 500,
                    system_health: 80
                };
                
                const timestamp = new Date();
                
                // Update each chart
                addDataToChart(systemLoadChart, timestamp, data.system_load);
                addDataToChart(networkLatencyChart, timestamp, data.network_latency);
                addDataToChart(dataThroughputChart, timestamp, data.data_throughput);
                addDataToChart(systemHealthChart, timestamp, data.system_health);
                
                // Update digital thread visualization
                updateDigitalThread(data);
            });
        }
    }
});

// Function to handle slider adjustments without API calls
function handleSliderAdjustment() {
    // Get adjustment values from sliders
    const systemLoadValue = parseInt(document.getElementById('systemLoadSlider').value);
    const networkLatencyValue = parseInt(document.getElementById('networkLatencySlider').value);
    const dataThroughputValue = parseInt(document.getElementById('dataThroughputSlider').value);
    
    // Display adjustment values
    document.getElementById('systemLoadValue').textContent = `${systemLoadValue}%`;
    document.getElementById('networkLatencyValue').textContent = `${networkLatencyValue}ms`;
    document.getElementById('dataThroughputValue').textContent = `${dataThroughputValue}Mbps`;
    
    // Create adjusted data
    const adjustedData = {
        system_load: systemLoadValue,
        network_latency: networkLatencyValue,
        data_throughput: dataThroughputValue,
        system_health: Math.min(100, Math.max(0, 
            100 - (systemLoadValue * 0.4) - (networkLatencyValue * 0.2) + (dataThroughputValue * 0.02)
        ))
    };
    
    // Update charts and visualization
    const timestamp = new Date();
    addDataToChart(systemLoadChart, timestamp, adjustedData.system_load);
    addDataToChart(networkLatencyChart, timestamp, adjustedData.network_latency);
    addDataToChart(dataThroughputChart, timestamp, adjustedData.data_throughput);
    addDataToChart(systemHealthChart, timestamp, adjustedData.system_health);
    
    // Update digital thread visualization
    updateDigitalThread(adjustedData);
} 