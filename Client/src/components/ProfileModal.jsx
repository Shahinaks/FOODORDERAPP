import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const ProfileModal = ({ show, handleClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
      handleClose();
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const getInitial = () => {
    const name = currentUser?.displayName || currentUser?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div
          className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
          style={{ width: 50, height: 50, fontSize: '1.5rem' }}
        >
          {getInitial()}
        </div>
        <div className="ms-3">
          <h5 className="mb-0">{currentUser?.displayName || currentUser?.email}</h5>
          <small className="text-muted">{currentUser?.email}</small>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Button variant="outline-dark" className="w-100 mb-2" onClick={() => { navigate('/my-orders'); handleClose(); }}>
          My Orders
        </Button>
        <Button variant="outline-dark" className="w-100 mb-2" onClick={() => { navigate('/wishlist'); handleClose(); }}>
          Wishlist
        </Button>
        <Button variant="outline-dark" className="w-100 mb-2" onClick={() => { navigate('/cart'); handleClose(); }}>
          Cart
        </Button>
        <Button variant="danger" className="w-100 mt-3" onClick={logout}>
          Logout
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
