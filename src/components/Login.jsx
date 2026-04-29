import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, adminLogin as adminLoginAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const canvasRef = useRef(null);

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
      setMessage('Incorrect CAPTCHA. Please try again.');
      refreshCaptcha();
      return;
    }

    try {
      if (role === 'admin') {
        const data = await adminLoginAPI(username, password);
        login({ username }, 'admin', null);
        setMessage('Login Successful');
        setTimeout(() => navigate('/admin/home'), 1000);
      } else {
        const data = await loginAPI(username, password);
        login({ username }, 'user', data.token);
        setMessage('Login Successful');
        setTimeout(() => navigate('/user/home'), 1000);
      }
    } catch (error) {
      setMessage(error.response?.data || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', color: '#667eea', marginBottom: '10px' }}>🎓 CertTracker</h2>
          <p style={{ color: '#666' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}>Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>CAPTCHA Verification</label>
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
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', letterSpacing: '2px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            Login
          </button>
          <button type="button" onClick={onBack} style={{ width: '100%', padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
            Back to Home
          </button>
        </form>
        {message && (
          <div style={{ marginTop: '20px', padding: '12px', background: message.includes('successfully') || message.includes('successfull') ? '#d4edda' : '#f8d7da', color: message.includes('successfully') || message.includes('successfull') ? '#155724' : '#721c24', borderRadius: '5px', textAlign: 'center' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
