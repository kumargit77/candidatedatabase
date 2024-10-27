const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

// Middleware to handle CORS
app.use(cors({
  origin: "http://localhost:5173",  // Adjust as needed for frontend port
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true  // Allow cookies and headers if needed
}));

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory users array
let users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: true },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', status: false },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '345-678-9012', status: true },
  { id: 4, name: 'Sarah Brown', email: 'sarah.brown@example.com', phone: '456-789-0123', status: false },
  { id: 5, name: 'Chris Lee', email: 'chris.lee@example.com', phone: '567-890-1234', status: true },
];

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Add a new user
app.post('/users', (req, res) => {
  const { name, email, phone, status } = req.body;
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    phone,
    status
  };
  users.push(newUser);
  res.json(users);  // Return the updated user list
});

// Edit a user by id
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, status } = req.body;
  users = users.map((user) =>
    user.id === id ? { ...user, name, email, phone, status } : user
  );
  res.json(users);  // Return the updated user list after modification
});

// Delete a user by id
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((user) => user.id !== id);
  res.json(users);  // Return the updated user list after deletion
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on http://localhost:${port}`);
  }
});
