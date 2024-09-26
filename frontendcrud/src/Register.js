import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css'
const RegistrationForm = () => {
    const PORT=8888
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:${PORT}/users`);
      setDataList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:${PORT}/users/${dataList[editIndex].id}`, formData);
        setEditIndex(null);
      } else {
        await axios.post(`http://localhost:${PORT}/users`, formData);
      }
      setFormData({ name: '', email: '' });
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(dataList[index]);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:${PORT}/users/${dataList[index].id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
      </form>

      <h3>Registered Users</h3>
      {dataList.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registered users yet.</p>
      )}
    </div>
  );
};

export default RegistrationForm;
