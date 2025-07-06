import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import loginBoardImage from '../assets/login-tablet-bg.png';

const API = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      console.log("Logged in UID:", user.uid); 

      const token = await user.getIdToken();
      localStorage.setItem('firebase_token', token);

      const res = await fetch(`${API}/users/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch user role');
      const data = await res.json();

      navigate(data.user.role === 'admin' ? '/admin/overview' : '/menu');
    } catch (err) {
      console.error('Login error:', err.code);
      if (err.code === 'auth/user-not-found') {
        setError('User not found. Please check your email or sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('This account may be linked with Google. Try using "Continue with Google".');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google login:', user.email);

      const providerAlreadyLinked = user.providerData.some(p => p.providerId === 'password');
      if (!providerAlreadyLinked) {
        const emailCredential = EmailAuthProvider.credential(form.email, form.password);
        try {
          await linkWithCredential(user, emailCredential);
        } catch (linkErr) {
          console.error('Linking error:', linkErr.code);
          if (linkErr.code === 'auth/provider-already-linked') {
            setError('This account is already linked with a password. Try logging in manually.');
            return;
          }
        }
      }

      const token = await user.getIdToken();
      localStorage.setItem('firebase_token', token);

      const res = await fetch(`${API}/users/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch user role');
      const data = await res.json();

      navigate(data.user.role === 'admin' ? '/admin/overview' : '/menu');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed.');
    }
  };


  const handleResetPassword = async () => {
    if (!form.email) return setError('Enter your email to reset password');
    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage('Password reset link sent to your email');
    } catch (err) {
      setError('Failed to send reset email');
    }
  };

  const formBoxStyle = {
    ...styles.formBox,
    ...(isMobile ? styles.formBoxMobile : {
      width: '58%',
      textAlign: 'center',
    }),
  };

  const headingStyle = {
    ...styles.heading,
    ...(isMobile ? {} : {
      fontSize: '1.5rem',
      textAlign: 'center',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <img src={loginBoardImage} alt="Login Background" style={styles.image} />
        <div style={formBoxStyle}>
          <h5 style={headingStyle}>Welcome! 🍔 Foodie</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <div style={styles.socialRow}>
            <Button onClick={handleGoogleLogin} style={styles.googleBtn} className="w-100">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                style={{ width: 20, marginRight: 10 }}
              />
              Continue with Google
            </Button>
          </div>

          <div style={styles.divider}>~ Or ~</div>

          <Form onSubmit={handleSubmit}>
            <Form.Group style={styles.inputGroup}>
              <Form.Label style={styles.label}><FaEnvelope /> Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </Form.Group>

            <Form.Group style={styles.inputGroup}>
              <Form.Label style={styles.label}><FaLock /> Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, paddingRight: '2.5rem' }}
                />
                <span
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>

            <div style={styles.extraRow}>
              <Form.Check type="checkbox" label="Remember Me" style={styles.label} />
              <span style={styles.forgotLink} onClick={handleResetPassword}>Forgot?</span>
            </div>

            <Button type="submit" style={styles.submitBtn}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
            </Button>
          </Form>

          <div style={styles.signupLink}>
            Don’t have an account? <a href="/signup" style={styles.link}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fceee3',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '960px',
  },
  image: {
    width: '120%',
    height: '90vh',
    display: 'block',
  },
  formBox: {
    position: 'absolute',
    top: '50%',
    left: '67%',
    transform: 'translate(-50%, -50%)',
    width: '20%',
    maxWidth: '320px',
    fontFamily: '"Architects Daughter", "Courier New", monospace',
    color: '#fff',
    padding: '0.5rem',
  },
  formBoxMobile: {
    top: '20%',
    left: '76%',
    transform: 'translate(-50%, 0)',
    width: '60%',
    textAlign: 'center',
    padding: '0.5rem',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontWeight: '300',
    color: '#fff',
    fontSize: '1.2rem',
  },
  inputGroup: {
    marginBottom: '0.4rem',
  },
  label: {
    fontSize: '0.8rem',
    color: '#f0f0f0',
    marginBottom: '0.2rem',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px dashed #fff',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    borderRadius: '0',
    fontSize: '0.85rem',
    padding: '0.25rem 0',
    textAlign: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#fff',
  },
  socialRow: {
    marginBottom: '12px',
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    color: '#444',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.45rem 1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  divider: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: '10px',
    fontSize: '0.85rem',
  },
  extraRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    color: '#ddd',
  },
  forgotLink: {
    cursor: 'pointer',
    color: '#ff944d',
  },
  submitBtn: {
    backgroundColor: '#ff4d1a',
    border: 'none',
    width: '100%',
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#fff',
  },
  link: {
    color: '#ff944d',
    textDecoration: 'underline',
  },
};

export default LoginPage;
