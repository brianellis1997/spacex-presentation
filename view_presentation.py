#!/usr/bin/env python3
"""
Simple HTTP server to view the presentation locally
Run: python view_presentation.py
Then open: http://localhost:8888
"""

import http.server
import socketserver
import webbrowser
import os
import socket

def find_free_port(start_port=8888):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', port))
                return port
            except OSError:
                continue
    return None

PORT = find_free_port()

if PORT is None:
    print("Could not find a free port. Please close other applications and try again.")
    exit(1)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Allow port reuse
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Serving presentation at http://localhost:{PORT}")
    print(f"Opening browser at http://localhost:{PORT}/index.html")
    print("Press Ctrl+C to stop the server")
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()