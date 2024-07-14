import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  onUpdate: (updatedData: { email: string; firstname: string; lastname: string }) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState(userData.username);
  const [updatedEmail, setUpdatedEmail] = useState(userData.email);
  const [updatedFirstname, setUpdatedFirstname] = useState(userData.firstname);
  const [updatedLastname, setUpdatedLastname] = useState(userData.lastname);

  const handleUpdate = () => {
    onUpdate({
      email: updatedEmail,
      firstname: updatedFirstname,
      lastname: updatedLastname
    });
    setIsEditing(false);
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label> Username </Form.Label>
              <Form.Control type="text" value={updatedUsername} onChange={(e) => setUpdatedUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicFirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={updatedFirstname} onChange={(e) => setUpdatedFirstname(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicLastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={updatedLastname} onChange={(e) => setUpdatedLastname(e.target.value)} />
            </Form.Group>
          </Form>
        ) : (
          <>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>First Name: {userData.firstname}</p>
            <p>Last Name: {userData.lastname}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfileModal;
