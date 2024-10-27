import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userData, setUserData] = useState({ id: null, name: "", email: "", phone: "", status: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const getAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText)
    );
    setFilteredUsers(filteredUsers);
  };

  // Delete function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:8000/users/${id}`);
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Function to open modal for adding a user
  const handleAddRecord = () => {
    setUserData({ id: null, name: "", email: "", phone: "", status: true }); // Reset user data
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Function to open modal for editing a user
  const handleEditData = (user) => {
    setUserData(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Function to handle user input in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: name === "status" ? value === "true" : value });
  };

  // Function to handle submission of user data (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Edit user
        const res = await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        setUsers(res.data);
        setFilteredUsers(res.data);
      } else {
        // Add new user
        const res = await axios.post('http://localhost:8000/users', userData);
        setUsers(res.data);
        setFilteredUsers(res.data);
      }
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="container">
      <h3>User Management Dashboard</h3>
      <div className="input-search">
        <input
          type="search"
          placeholder="Search by Name or Email"
          onChange={handleSearchChange}
        />
        <button className="btn blue" onClick={handleAddRecord}>Add Record</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.status ? "Active" : "Inactive"}</td>
              <td>
                <button className="btn green" onClick={() => handleEditData(user)}>Edit</button>
              </td>
              <td>
                <button
                  className="btn red"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding/editing a user */}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h4>{isEditMode ? "Edit User" : "Add New User"}</h4>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input type="text" name="name" value={userData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Status:</label>
                <select name="status" value={userData.status} onChange={handleInputChange}>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn red">{isEditMode ? "Save Changes" : "Add User"}</button>
              <button type="button" className="btn red" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
