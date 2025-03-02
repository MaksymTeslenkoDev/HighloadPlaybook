# 🚀 Application Setup Guide

This guide will walk you through the correct process of setting up and running the application using Docker and Docker volumes.

---

## **📌 Prerequisites**
Before proceeding, ensure you have the following installed:
- **Docker** (>= 20.x)
- **Docker Compose** (>= 1.29.x)
- **Bash** (for running scripts, included by default in Linux/macOS, or use Git Bash on Windows)

---

## **🛠 Step 1: Create a Docker Volume and Copy the Config File**
Before running the application, you must create a Docker volume and store the `server.config.json` file inside it.

Run the following command:

```sh
chmod +x ./scripts/config.create.sh
./scripts/config.create.sh <VOLUME_NAME> <PATH_TO_CONFIG_FILE>
```

### **Example Usage:**
```sh
chmod +x ./scripts/config.update.sh
./scripts/config.create.sh server_config ./pkg/server/server.config.json
```

✅ This script will:
1. **Create a Docker volume** named `<VOLUME_NAME>`.
2. **Copy the provided `server.config.json` file** into the volume.
3. **Ensure the file persists** inside the volume for the application to use.

---

## **📌 Step 2: Run the Application with Docker Compose**
Once the volume is created and the config file is stored, you can start the application using Docker Compose.

Run:

```sh
docker-compose up -d --build
```

✅ This command will:
- **Build the application image** if needed.
- **Start the application in detached mode** (`-d`).
- **Mount the pre-created volume (`config_volume`)** so the app can read the config file.

---

## **🛠 Step 3: Verify the Config File in the Running Container**
After starting the application, you can verify that the config file is correctly stored inside the container:

```sh
docker exec -it $(docker-compose ps -q app) ls -la /config/
```

To check the contents of the config file inside the container:

```sh
docker exec -it $(docker-compose ps -q app) cat /config/server.config.json
```

✅ If everything is set up correctly, you should see the `server.config.json` file inside `/config/` in the container.

---

## **📌 Step 4: Updating the Config File**
If you need to update the `server.config.json` file inside the volume, run:

```sh
./scripts/config.update.sh <VOLUME_NAME> <PATH_TO_NEW_CONFIG_FILE>
```

Then restart the container:

```sh
docker-compose restart app
```

✅ This ensures that the updated config file is loaded into the running application.

---

## **📌 Stopping and Removing the Application**
To stop and remove all running containers:

```sh
docker-compose down
```

To remove the manually created volume (⚠️ This will delete the stored config file!):

```sh
docker volume rm config_volume
```

---

## **🎯 Summary of Workflow**
1. **Create a Docker volume and copy the config file**:  
   ```sh
   ./scripts/config.create.sh config_volume ./pkg/server/server.config.json
   ```
2. **Run the application using Docker Compose**:  
   ```sh
   docker-compose up -d --build
   ```
3. **Verify that the config file exists inside the container**:  
   ```sh
   docker exec -it $(docker-compose ps -q app) ls -la /config/
   ```
4. **Update the config file (if needed)**:  
   ```sh
   ./scripts/config.update.sh config_volume ./pkg/server/server.config.json
   ```
5. **Restart the container to apply the new config**:  
   ```sh
   docker-compose restart app
   ```
6. **Stop and remove containers when done**:  
   ```sh
   docker-compose down
   ```

🚀 **Your application is now set up and running with a managed Docker volume for configuration!** Let me know if you need any refinements. 🔥😊

