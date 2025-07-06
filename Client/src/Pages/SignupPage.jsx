import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import easelBoard from '../assets/signup-easel.png';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate('/menu');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/menu');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Create Your Foodie Account</h2>

      <div style={styles.easelWrapper}>
        <img
          src={easelBoard}
          alt="easel"
          style={{
            ...styles.easelImage,
            ...(isMobile ? styles.easelImageMobile : {}),
          }}
        />

        <div
          style={{
            ...styles.formContainer,
            ...(isMobile ? styles.formContainerMobile : {}),
          }}
        >
          <div
            style={{
              ...styles.googleWrapper,
              ...(isMobile ? styles.googleWrapperMobile : {}),
            }}
            onClick={handleGoogleLogin}
          >
            <FaGoogle size={12} color="#333" style={{ marginRight: 6 }} />
            <span style={styles.googleText}>Sign up with Google</span>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Control
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              style={styles.input}
            />
            <Form.Control
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={styles.input}
            />
            <Form.Control
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              style={styles.input}
            />

            <div style={styles.passwordWrapper}>
              <Form.Control
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={handleChange}
                style={styles.input}
              />
              <span
                style={styles.toggle}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div style={styles.passwordWrapper}>
              <Form.Control
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                onChange={handleChange}
                style={styles.input}
              />
              <span
                style={styles.toggle}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <Button type="submit" style={styles.button}>
              Sign Up
            </Button>
          </Form>

          <div style={styles.footerText}>
            Already have an account?{' '}
            <span
              style={styles.loginLink}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 Styles
const styles = {
  page: {
    backgroundColor: '#2c1d0f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    padding: '1rem',
    fontFamily: "'Schoolbell', cursive",
  },
  heading: {
    color: '#fceee3',
    fontSize: '1.8rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  easelWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '1024px',
  },
  easelImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  easelImageMobile: {
    height: '80vh',
    objectFit: 'cover',
  },
  formContainer: {
    position: 'absolute',
    top: '46%',
    left: '69%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxWidth: '290px',
    padding: 0,
  },
  formContainerMobile: {
    top: '43%',
    left: '70%',
    transform: 'translate(-50%, -50%)',
    width: '78%',
    maxWidth: '250px',
    padding: '0.5rem',
  },
  googleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: '0.45rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  googleWrapperMobile: {
    padding: '0.35rem 0.6rem',
    fontSize: '0.75rem',
    transform: 'scale(0.9)',
  },
  googleText: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: 'transparent',
    color: '#000',
    border: 'none',
    borderBottom: '1px dashed #fceee3',
    borderRadius: 0,
    marginBottom: '12px',
    fontSize: '1rem',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff4d1a',
    border: 'none',
    width: '100%',
    padding: '0.6rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  passwordWrapper: {
    position: 'relative',
  },
  toggle: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#fceee3',
  },
  footerText: {
    marginTop: '0.8rem',
    fontSize: '0.85rem',
    textAlign: 'center',
    color: 'black',
  },
  loginLink: {
    color: '#ff944d',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default SignupPage;
