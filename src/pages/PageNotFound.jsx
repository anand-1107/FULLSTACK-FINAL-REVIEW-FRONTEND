import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: 'clamp(48px, 10vw, 120px)', color: '#667eea', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#333', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#666', marginBottom: '30px' }}>The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} style={{ padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
        Go Home
      </button>
    </div>
  );
};

export default PageNotFound;
