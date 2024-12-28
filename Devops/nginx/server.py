import socket
import threading
import json
from datetime import datetime

# Server configuration
HOST = '0.0.0.0'  # Replace with your server IP
PORT = 9090            # Port to listen on
LOG_FILE = "requests.json"  # Unified JSON log file

def extract_json(raw_data: str) -> str:
    """Extract JSON content by trimming data before '{' and after '}'."""
    start = raw_data.find('{')
    end = raw_data.rfind('}')
    
    if start != -1 and end != -1 and end > start:
        return raw_data[start:end + 1]  # Include both brackets
    return None

def log_raw_data(json_data: str):
    """Log JSON data to the file after adding a timestamp."""
    try:
        data = json.loads(json_data)  # Parse JSON string into a dictionary
        data['timestamp'] = datetime.now().isoformat()  # Add timestamp in ISO format
        
        with open(LOG_FILE, "a") as log_file:
            log_file.write(json.dumps(data) + "\n")  # Save as JSON string
    except json.JSONDecodeError:
        print("Invalid JSON format, cannot add timestamp.")
    except Exception as e:
        print(f"Failed to write to {LOG_FILE}: {e}")

def handle_client(client_socket):
    """Handle client connection and log JSON data."""
    try:
        # Receive data from the client
        request = client_socket.recv(4096).decode('utf-8')
        
        # Extract JSON from the body
        json_data = extract_json(request)
        
        if json_data:
            print(json_data)  # Display only the JSON part in the terminal
            log_raw_data(json_data)  # Save JSON part to the log file with timestamp
        else:
            print("No valid JSON found in the request.")
        
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
    
    try:
        while True:
            client_socket, addr = server.accept()
            print(f"\nNew connection from {addr}")
            # Handle the client in a separate thread
            client_thread = threading.Thread(target=handle_client, args=(client_socket,))
            client_thread.start()
    except KeyboardInterrupt:
        print("\nServer shutting down.")
    finally:
        server.close()

if __name__ == "__main__":
    start_server()
