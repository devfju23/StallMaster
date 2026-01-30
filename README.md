# StallMaster

This is a Next.js application for a drink stall's order and record system. It is designed to run locally on your computer without requiring any paid cloud hosting.

## How to Download and Run Locally

Follow these steps to get the application running on your personal computer.

### Step 1: Prerequisite - Install Node.js
If you do not already have Node.js installed, please download and install it from the official website: [https://nodejs.org/](https://nodejs.org/). This is required to run the application.

### Step 2: Download the Project Files
1.  Open a terminal in the Firebase Studio environment.
2.  Run the following command:
    ```bash
    npm run zip
    ```
3.  Find the `StallMaster.zip` file in the file explorer and download it to your computer.

### Step 3: Running in VS Code (Recommended)
1.  Extract `StallMaster.zip` into a folder.
2.  Open **VS Code**.
3.  Go to `File` > `Open Folder...` and select the extracted folder.
4.  Open the integrated terminal in VS Code (`Terminal` > `New Terminal`).
5.  Install the dependencies:
    ```bash
    npm install
    ```
    *Note: You may see some `npm warn deprecated` messages. These are normal and will not prevent the app from running.*
6.  Start the local development server:
    ```bash
    npm run dev
    ```

### Step 4: Access the App
Open your web browser and go to: [http://localhost:9002](http://localhost:9002)

## Troubleshooting
If you see errors in VS Code, try these steps:
1. Ensure you ran `npm install` successfully.
2. Ensure you are using a modern version of Node.js (v18 or higher).
3. If styling looks off, try restarting the `npm run dev` command.

## Important Note on Data
Currently, this app uses an **in-memory database**.
- **Data Persistence:** If you stop the terminal or restart VS Code, the sales records for that session will be cleared. This is ideal for a "daily" tracker that starts fresh each morning!