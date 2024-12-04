import socket
import threading
import json

# Server configuration
HOST = '127.0.0.1'  # Localhost
PORT = 9090    # Port to listen on
LOG_FILE = "post_requests.json"

def handle_client(client_socket):
    """Handle client connection and log POST request JSON body."""
    try:
        # Receive data from the client
        request = client_socket.recv(4096).decode('utf-8')
        
        # Process only POST requests
        if request.startswith("POST"):
            # Extract the body (assuming JSON) from the POST request
            _, body = request.split("\r\n\r\n", 1)
            
            # Validate that the body is valid JSON
            try:
                json_body = json.loads(body)  # Parse JSON
            except json.JSONDecodeError:
                print(f"Invalid JSON received: {body}")
                client_socket.sendall("HTTP/1.1 400 Bad Request\r\n\r\nInvalid JSON".encode('utf-8'))
                return
            
            # Append the JSON body to the log file
            try:
                with open(LOG_FILE, "r") as log_file:
                    logs = json.load(log_file)  # Load existing logs
            except (FileNotFoundError, json.JSONDecodeError):
                logs = []  # Initialize logs if file doesn't exist or is invalid
            
            logs.append(json_body)
            with open(LOG_FILE, "w") as log_file:
                json.dump(logs, log_file, indent=4)
            
            print(f"Logged JSON body: {json_body}")
        
        # Send a response to the client
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nRequest received"
        client_socket.sendall(response.encode('utf-8'))
    except Exception as e:
        print(f"Error handling client: {e}")
    finally:
        client_socket.close()

def start_server():
    """Start the TCP server."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen(5)
    print(f"Server listening on {HOST}:{PORT}")
    
    while True:
        client_socket, addr = server.accept()
        print(f"Connection received from {addr}")
        # Handle the client in a separate thread
        client_thread = threading.Thread(target=handle_client, args=(client_socket,))
        client_thread.start()

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\nServer shutting down.")
