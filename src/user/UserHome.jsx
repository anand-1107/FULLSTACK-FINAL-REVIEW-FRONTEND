import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import { getCertificatesByUser } from '../api/certificate';
import { useAuth } from '../context/AuthContext';
import './UserTheme.css';

const DEMO_CERTS = [
  { id: 1, certName: 'AWS Certified Solutions Architect', orgName: 'Amazon Web Services', issueDate: '2023-06-15', expiryDate: '2026-06-15' },
  { id: 2, certName: 'Google Cloud Professional', orgName: 'Google', issueDate: '2023-09-01', expiryDate: '2025-09-01' },
  { id: 3, certName: 'Microsoft Azure Fundamentals', orgName: 'Microsoft', issueDate: '2024-01-10', expiryDate: '2027-01-10' },
];

const UserHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id !== undefined) fetchCerts();
  }, [user]);

  const fetchCerts = async () => {
    const local = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    try {
      const data = await getCertificatesByUser(user.id);
      setCerts(data && data.length > 0 ? [...data, ...local] : [...DEMO_CERTS, ...local]);
    } catch {
      setCerts([...DEMO_CERTS, ...local]);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const active = certs.filter(c => new Date(c.expiryDate) >= today);
  const expiring = certs.filter(c => {
    const d = new Date(c.expiryDate);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 30;
  });
  const expired = certs.filter(c => new Date(c.expiryDate) < today);
  const health = certs.length === 0 ? 0 : Math.round((active.length / certs.length) * 100);

  const recentCerts = [...certs].reverse().slice(0, 4);

  const getStatusInfo = (expiryDate) => {
    const diff = Math.ceil((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Expired', cls: 'dash-tag-expired' };
    if (diff <= 30) return { label: `${diff}d left`, cls: 'dash-tag-warn' };
    return { label: 'Active', cls: 'dash-tag-active' };
  };

  const circumference = 2 * Math.PI * 36;
  const strokeDash = circumference - (health / 100) * circumference;

  return (
    <div className="user-page">
      <UserNavBar />
      <div className="user-shell">
        <div className="dash-layout">

          {/* ── Left sidebar ── */}
          <aside className="dash-sidebar">
            <div className="dash-profile-card">
              <div className="dash-avatar">
                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <p className="dash-profile-name">{user?.name || user?.username || 'User'}</p>
              <p className="dash-profile-role">Certificate Holder</p>
              <div className="dash-profile-divider" />
              <div className="dash-health-ring-wrap">
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(14,165,233,0.1)" strokeWidth="8" />
                  <circle
                    cx="44" cy="44" r="36" fill="none"
                    stroke={health >= 70 ? '#22c55e' : health >= 40 ? '#fb923c' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDash}
                    transform="rotate(-90 44 44)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                  <text x="44" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="#082035">
                    {loading ? '–' : `${health}%`}
                  </text>
                </svg>
                <p className="dash-health-label">Portfolio Health</p>
              </div>
            </div>

            <div className="dash-sidebar-nav">
              <button className="dash-sidebar-btn dash-sidebar-btn-primary" onClick={() => navigate('/user/add-certificate')}>
                <span>＋</span> Add Certificate
              </button>
              <button className="dash-sidebar-btn" onClick={() => navigate('/user/view-certificates')}>
                <span>☰</span> Manage Certificates
              </button>
              <button className="dash-sidebar-btn" onClick={() => navigate('/user/profile')}>
                <span>◎</span> My Profile
              </button>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="dash-main">

            {/* Greeting banner */}
            <div className="dash-greeting">
              <div>
                <p className="dash-greeting-sub">Welcome back,</p>
                <h1 className="dash-greeting-name">{user?.name || user?.username || 'User'} 👋</h1>
              </div>
              {expiring.length > 0 && (
                <div className="dash-alert-pill">
                  ⚠️ {expiring.length} certificate{expiring.length > 1 ? 's' : ''} expiring soon
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="dash-stats-strip">
              <div className="dash-stat-tile dash-stat-total">
                <span className="dash-stat-icon">🗂</span>
                <div>
                  <p className="dash-stat-num">{loading ? '–' : certs.length}</p>
                  <p className="dash-stat-lbl">Total</p>
                </div>
              </div>
              <div className="dash-stat-tile dash-stat-active">
                <span className="dash-stat-icon">✅</span>
                <div>
                  <p className="dash-stat-num">{loading ? '–' : active.length}</p>
                  <p className="dash-stat-lbl">Active</p>
                </div>
              </div>
              <div className="dash-stat-tile dash-stat-expiring">
                <span className="dash-stat-icon">⏳</span>
                <div>
                  <p className="dash-stat-num">{loading ? '–' : expiring.length}</p>
                  <p className="dash-stat-lbl">Expiring</p>
                </div>
              </div>
              <div className="dash-stat-tile dash-stat-expired">
                <span className="dash-stat-icon">🚫</span>
                <div>
                  <p className="dash-stat-num">{loading ? '–' : expired.length}</p>
                  <p className="dash-stat-lbl">Expired</p>
                </div>
              </div>
            </div>

            {/* Recent certificates */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h2 className="dash-section-title">Recent Certificates</h2>
                <button className="dash-see-all" onClick={() => navigate('/user/view-certificates')}>
                  See all →
                </button>
              </div>

              {loading ? (
                <p className="dash-empty">Loading...</p>
              ) : recentCerts.length === 0 ? (
                <div className="dash-empty-state">
                  <span>📭</span>
                  <p>No certificates yet.</p>
                  <button className="user-btn user-btn-primary" onClick={() => navigate('/user/add-certificate')}>
                    Add your first certificate
                  </button>
                </div>
              ) : (
                <div className="dash-recent-list">
                  {recentCerts.map((cert) => {
                    const status = getStatusInfo(cert.expiryDate);
                    return (
                      <div key={cert.id} className="dash-recent-row">
                        <div className="dash-recent-dot" />
                        <div className="dash-recent-info">
                          <p className="dash-recent-name">{cert.certName}</p>
                          <p className="dash-recent-org">{cert.orgName}</p>
                        </div>
                        <div className="dash-recent-meta">
                          <span className="dash-recent-date">Expires {cert.expiryDate}</span>
                          <span className={`dash-tag ${status.cls}`}>{status.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick tips */}
            <div className="dash-tips-row">
              <div className="dash-tip-card dash-tip-blue">
                <span className="dash-tip-icon">💡</span>
                <p>Keep your certificates updated to maintain an accurate portfolio.</p>
              </div>
              <div className="dash-tip-card dash-tip-green">
                <span className="dash-tip-icon">🔔</span>
                <p>Renew certificates at least 30 days before they expire.</p>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
