# API Item Repository

This project is a Node.js-based RESTful API designed to manage items. It provides endpoints to create, read, update, and delete items, facilitating efficient item management.

## Features

- **CRUD Operations**: Supports Create, Read, Update, and Delete functionalities for items.
- **Modular Structure**: Organized using controllers, models, routes, and utilities for maintainability.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Branko-Rajkovic/api-item-repo.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd api-item-repo
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Usage

1. **Start the Server**:

   ```bash
   npm start
   ```

   By default, the server runs on `http://localhost:3000`.

2. **API Endpoints**:

   - **Get All Items**:

     ```http
     GET /api/items
     ```

   - **Get Single Item**:

     ```http
     GET /api/items/:id
     ```

   - **Create New Item**:

     ```http
     POST /api/items
     ```

     **Request Body**:

     ```json
     {
       "name": "Item Name",
       "description": "Item Description"
     }
     ```

   - **Update Item**:

     ```http
     PUT /api/items/:id
     ```

     **Request Body**:

     ```json
     {
       "name": "Updated Name",
       "description": "Updated Description"
     }
     ```

   - **Delete Item**:

     ```http
     DELETE /api/items/:id
     ```

## Project Structure

```plaintext
api-item-repo/
├── controllers/
│   └── itemController.js
├── models/
│   └── itemModel.js
├── routes/
│   └── itemRoutes.js
├── utils/
│   └── db.js
├── app.js
├── server.js
├── package.json
└── .gitignore
```

- **`controllers/`**: Contains functions handling the logic for each route.
- **`models/`**: Defines the data structure for items.
- **`routes/`**: Manages the routing of API endpoints.
- **`utils/`**: Includes utility functions, such as database connections.
- **`app.js`**: Initializes the application and middleware.
- **`server.js`**: Starts the server and listens on the specified port.

