## SimplePay

Welcome to the **SimplePay project**! Our platform streamlines payment and transaction management, providing comprehensive solutions for both backend and frontend operations. 💳💻
### Backend Setup

To get the backend server up and running, please follow these steps:

1. Optionally, you can run the following command to install backend dependencies:

    ```bash
    npm install
    ```

2. Navigate to the backend directory:

    ```bash
    cd backend
    npm install
    ```

3. In the backend directory, you'll find an `db.js` file, replace `MONGO_LINK` with your MongoDB connection URL.
 
    ```plaintext
    MONGODB_URL=//YourMongoDBURLHere
    ```

4. In the backend directory, you'll also find an `config.js` file, Replace `jwt_secret` with your chosen secret key for JWT (JSON Web Tokens).

    ```plaintext
    JWT_SECRET=//YourSecretKeyHere
    ```


5. Start the server by running the following command:

    ```bash
    node index.js
    ```


### Frontend Setup

To begin with the frontend application, follow these steps:

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    npm install
    ```

2. Run the following command to start the application:

    ```bash
    npm run dev
    ```

    This command will initiate the frontend application.
