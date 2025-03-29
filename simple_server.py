from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
            }
            h1 {
                color: #4CAF50;
            }
            .box {
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 5px;
                background-color: #f9f9f9;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Server is working!</h1>
        <div class="box">
            <p>This is a simple Flask server running on port 3333.</p>
            <p>If you can see this page, your web browser can connect to the server.</p>
            <p>Current time: <strong id="time"></strong></p>
        </div>
        
        <script>
            // Update time every second
            function updateTime() {
                document.getElementById('time').textContent = new Date().toLocaleTimeString();
            }
            updateTime();
            setInterval(updateTime, 1000);
        </script>
    </body>
    </html>
    """

if __name__ == '__main__':
    print("==================================================")
    print("SIMPLE SERVER RUNNING AT: http://localhost:3333")
    print("==================================================")
    app.run(host='0.0.0.0', port=3333, debug=True) 