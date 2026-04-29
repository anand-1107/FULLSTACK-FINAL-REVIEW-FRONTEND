import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, adminLogin as adminLoginAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const drawCaptcha = useCallback((text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    // Noise lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255,255,255,0.2)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width, Math.random() * canvas.height,
        Math.random() * canvas.width, Math.random() * canvas.height,
        Math.random() * canvas.width, Math.random() * canvas.height
      );
      ctx.stroke();
    }
    
    // Draw text with shadow
    ctx.font = 'bold 36px Arial';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      const x = 15 + i * 28;
      const y = 30;
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillText(text[i], 2, 2);
      
      // Main text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    drawCaptcha(captcha);
  }, [captcha, drawCaptcha]);

  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setCaptchaInput('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      toast.error('Incorrect CAPTCHA. Please try again.');
      refreshCaptcha();
      return;
    }

    // Hardcoded credentials — login directly without API call
    const USERS = {
      user:  { username: 'user',  password: 'user',  id: 7, name: '2400030220', role: 'user',  path: '/user/home' },
      admin: { username: 'admin', password: 'admin', id: 1, name: 'Admin',      role: 'admin', path: '/admin/home' },
    };

    const creds = USERS[role];
    if (username.trim() !== creds.username || password !== creds.password) {
      toast.error('Invalid username or password');
      return;
    }

    // Get a real token from backend so API calls work
    try {
      const apiCall = role === 'admin' ? adminLoginAPI : loginAPI;
      const data = await apiCall(username, password);
      login({ username: creds.username, name: creds.name, id: creds.id }, creds.role, data.token);
    } catch {
      // backend unreachable — still allow login with demo token
      login({ username: creds.username, name: creds.name, id: creds.id }, creds.role, 'demo-token');
    }

    toast.success('Login successful!');
    navigate(creds.path);
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient auth-ambient-left" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-right" aria-hidden="true" />

      <div className="auth-card">
        <div className="auth-header">
          <h2>CertTracker</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label>Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="auth-input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-field">
            <label>CAPTCHA Verification</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <canvas 
                ref={canvasRef} 
                width="200" 
                height="60" 
                style={{ 
                  border: '2px solid #667eea', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                }} 
              />
              <button 
                type="button" 
                onClick={refreshCaptcha} 
                style={{ 
                  padding: '12px 16px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '18px',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter the characters shown above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              className="auth-input"
              style={{ letterSpacing: '2px' }}
            />
          </div>
          <button type="submit" className="auth-btn auth-btn-primary">
            Login
          </button>
          <button type="button" onClick={() => navigate('/')} className="auth-btn auth-btn-secondary">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
