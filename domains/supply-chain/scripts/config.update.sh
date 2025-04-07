#!/bin/bash

# Ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <container_name> <config_path>"
    exit 1
fi

# Assign input parameters
SERVICE=$1
CONFIG_PATH=$2

# Check if container exists
if ! docker ps --format '{{.Names}}' | grep -q "^$SERVICE$"; then
    echo "Error: Container '$SERVICE' not found or not running!"
    exit 1
fi

# Check if config file exists
if [ ! -f "$CONFIG_PATH" ]; then
    echo "Error: Config file '$CONFIG_PATH' does not exist!"
    exit 1
fi

# Copy the config file into the running container
echo "Copying $CONFIG_PATH into $SERVICE:/home/app/node/config/app.config.json..."
docker cp "$CONFIG_PATH" "$SERVICE:/home/app/node/config/app.config.json"

# Restart the container to apply changes
echo "Restarting container: $SERVICE..."
docker container restart "$SERVICE"

echo "✅ Config updated and container restarted successfully!"
