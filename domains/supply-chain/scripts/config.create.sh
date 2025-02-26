#!/bin/bash

VOLUME_NAME=$1
CONFIG_FILE=$2

# Ensure the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: Config file '$CONFIG_FILE' not found!"
    exit 1
fi

# Create Docker volume
echo "📦 Creating Docker volume: $VOLUME_NAME..."
docker volume create $VOLUME_NAME

# Copy config file into volume
echo "📂 Copying $CONFIG_FILE into $VOLUME_NAME..."
docker run --rm -v $VOLUME_NAME:/config -v $(pwd)/$CONFIG_FILE:/tmp/server.config.json alpine sh -c "cp /tmp/server.config.json /config/server.config.json"

echo "✅ Config successfully copied to Docker volume: $VOLUME_NAME"
