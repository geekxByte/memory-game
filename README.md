# Memory-Game

A simple and interactive memory game built with React.js, Node.js, MongoDB, and CSS. The objective is to match pairs of cards by flipping them over, testing your memory and attention to detail.

## Features

- **Card Matching:** Flip cards to find matching pairs.
- **Score Tracking:** Keep track of your score and get the highest score.
- **Top Scorer:** Get the list of top scorers on the home page.

# Installation

## Frontend Setup

### Navigate to the Frontend Folder
   - Open your terminal or command prompt.
   - Change directory to the frontend folder using the command:
     
     ```
     cd frontend
     ```

### Install Dependencies
   - Run the command to install all necessary dependencies:
     
     ```
     npm install
     ```

### Configure Environment Variables
   - Create a `.env` file in the frontend directory.
   - Add the base URL of the deployed Railway app by including the following line in the `.env` file:
     
     ```
     REACT_APP_BASE_URL=<your-deployed-url>
     ```

### Start the Frontend Application
   - Launch the frontend application by running:
     
     ```
     npm start
     ```

## Backend Setup

### Navigate to the Backend Folder
   - Open your terminal or command prompt.
   - Change directory to the backend folder using the command:
     
     ```
     cd ../backend
     ```

### Install Dependencies
   - Run the command to install all necessary dependencies:
     
     ```
     npm install
     ```

### Configure Environment Variables
   - Create a `.env` file in the backend directory.
   - Add the JWT token and MongoDB URL by including the following lines in the `.env` file:
     
     ```
     JWT_SECRET=<your-jwt-token>
     MONGODB_URL=<your-mongodb-url>
     ```

### Start the Backend Server
   - Launch the backend server by running:
     
     ```
     node server.js
     ```

## Usage

- **Frontend:** Open your browser and navigate to `http://localhost:3000` to play the game.
- **Backend:** Ensure the backend server is running to handle requests from the frontend.

## Images

![Screenshot 2024-09-13 225423](https://github.com/user-attachments/assets/af173006-0bb7-4277-8c6d-d5846d144ec0)
![Screenshot 2024-09-13 225612](https://github.com/user-attachments/assets/915fdf9b-cb09-4bbf-b30b-69c1b75a44b7)
![Screenshot 2024-09-13 225702](https://github.com/user-attachments/assets/b1373485-057f-4cbb-acdb-017daa34d1df)
![Screenshot 2024-09-13 225904](https://github.com/user-attachments/assets/725f95ce-536a-4843-896e-915fc01c93bc)
