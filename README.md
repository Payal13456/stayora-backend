# Stayora Backend

A Node.js server for student authentication and property management APIs with MongoDB integration.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory and add your MongoDB connection string:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/stayora-db?retryWrites=true&w=majority
```

Replace `your-username`, `your-password`, and `cluster.mongodb.net` with your actual MongoDB Atlas credentials.

## Running the Server

```bash
npm start
```

The server will run on port 3000 and connect to MongoDB.

## Database Seeding

To populate the database with initial data, you can use MongoDB tools or create seed scripts. For cities and properties, insert documents into the respective collections.

Example for cities:
```javascript
db.cities.insertMany([
  { name: 'Mumbai' },
  { name: 'Delhi' },
  // ... more cities
]);
```

Example for properties:
```javascript
db.properties.insertMany([
  {
    name: 'Luxury Apartment in Mumbai',
    location: 'Mumbai',
    price: 5000000,
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2
  },
  // ... more properties
]);
```

## APIs

### Register a Student
- **Endpoint**: `POST /auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created` with message "Student registered successfully"

### Login a Student
- **Endpoint**: `POST /auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with JSON `{ "token": "jwt-token-here" }`

### Get Cities in India
- **Endpoint**: `GET /cities`
- **Response**: `200 OK` with JSON `{ "cities": ["Mumbai", "Delhi", ...] }`

### Get All Properties
- **Endpoint**: `GET /properties`
- **Response**: `200 OK` with JSON `{ "properties": [ { "id": 1, "name": "...", "location": "...", "price": 5000000, ... }, ... ] }`

## Notes
- Passwords are hashed using bcrypt.
- JWT tokens are issued on successful login.
- Data is now stored in MongoDB instead of in-memory storage.
- Ensure your MongoDB cluster allows connections from your IP address.