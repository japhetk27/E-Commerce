import React, { useState, useEffect } from 'react';

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Erreur lors de la récupération des informations utilisateur:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormData(userData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditMode(false);
      } else {
        console.error('Erreur lors de la mise à jour des informations utilisateur:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations utilisateur:', error);
    }
  };

  return (
    <div>
      <h2>Profil utilisateur</h2>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="firstname">Prénom :</label>
            <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="lastname">Nom :</label>
            <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
          <button type="submit">Enregistrer</button>
        </form>
      ) : (
        <div>
          <p><strong>Nom d'utilisateur :</strong> {userData.username}</p>
          <p><strong>Email :</strong> {userData.email}</p>
          <p><strong>Prénom :</strong> {userData.firstname}</p>
          <p><strong>Nom :</strong> {userData.lastname}</p>
          <button onClick={handleEdit}>Modifier</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
