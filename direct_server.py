import http.server
import socketserver
import os

PORT = 5000
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print(f"SERVING CONTENT ON http://localhost:{PORT}")
        print(f"TO QUIT, PRESS CTRL+C")
        print("=" * 50)
        httpd.serve_forever()

if __name__ == "__main__":
    run_server() 