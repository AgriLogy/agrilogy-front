# Use an official Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the server script to the working directory
COPY server_script.py /app/server_script.py

# Expose the required port
EXPOSE 9090

# Install any required Python packages (if any)
# Uncomment the following lines if you need dependencies listed in requirements.txt
# COPY requirements.txt /app/requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# Command to run the Python script
CMD ["python", "server.py"]
