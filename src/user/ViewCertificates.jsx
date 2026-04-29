import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import { getCertificatesByUser, deleteCertificate, downloadCertificate } from '../api/certificate';
import { login as loginAPI } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const DEMO_CERTS = [
  { id: 1, certName: 'AWS Certified Solutions Architect', orgName: 'Amazon Web Services', issueDate: '2023-06-15', expiryDate: '2026-06-15' },
  { id: 2, certName: 'Google Cloud Professional', orgName: 'Google', issueDate: '2023-09-01', expiryDate: '2025-09-01' },
  { id: 3, certName: 'Microsoft Azure Fundamentals', orgName: 'Microsoft', issueDate: '2024-01-10', expiryDate: '2027-01-10' },
];

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id !== undefined) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    const local = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    try {
      const tokenData = await loginAPI('user', 'user');
      sessionStorage.setItem('token', tokenData.token);
      const data = await getCertificatesByUser(user.id);
      const merged = data && data.length > 0 ? [...data, ...local] : [...DEMO_CERTS, ...local];
      setCertificates(merged);
    } catch {
      setCertificates([...DEMO_CERTS, ...local]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certId, certName) => {
    setDownloadingId(certId);
    try {
      const pdfBlob = await downloadCertificate(certId);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certName}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success('Certificate downloaded successfully');
    } catch {
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (certName, certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    // remove from localStorage
    const local = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    localStorage.setItem('user_certificates', JSON.stringify(local.filter(c => c.id !== certId)));
    try {
      await deleteCertificate(certName, user.id);
    } catch {
      // backend delete failed, localStorage already updated
    }
    toast.success('Certificate deleted successfully');
    fetchCertificates();
  };

  const getValidity = (expiryDate) => {
    if (!expiryDate) return { label: 'Unknown', type: 'unknown', pct: 0 };
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'Expired', type: 'expired', pct: 0 };
    if (diffDays <= 30) return { label: `${diffDays}d left`, type: 'warning', pct: Math.min((diffDays / 30) * 100, 100) };
    return { label: `${diffDays}d left`, type: 'valid', pct: Math.min((diffDays / 365) * 100, 100) };
  };

  const getAccent = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('aws') || n.includes('amazon')) return '#6366f1';
    if (n.includes('azure') || n.includes('microsoft')) return '#0ea5e9';
    if (n.includes('google')) return '#22c55e';
    return '#a78bfa';
  };

  const filtered = certificates.filter(c =>
    c.certName.toLowerCase().includes(search.toLowerCase()) ||
    c.orgName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-page">
      <UserNavBar />
      <div className="user-shell">

        <div className="manage-cert-header">
          <div>
            <h1 className="user-title">My Certificates</h1>
            <p className="user-subtitle">{certificates.length} credential{certificates.length !== 1 ? 's' : ''} in your portfolio</p>
          </div>
          <input
            className="manage-cert-search"
            placeholder="🔍  Search certificates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? <LoadingSpinner /> : (
          filtered.length === 0 ? (
            <div className="manage-cert-empty">
              <span className="manage-cert-empty-icon">📭</span>
              <p>{search ? 'No results match your search.' : 'No certificates yet. Add your first one!'}</p>
            </div>
          ) : (
            <div className="manage-cert-list">
              {filtered.map((cert) => {
                const validity = getValidity(cert.expiryDate);
                const accent = getAccent(cert.certName);
                return (
                  <div key={cert.id} className="manage-cert-row">
                    <div className="manage-cert-accent-bar" style={{ background: accent }} />

                    <div className="manage-cert-identity">
                      <div className="manage-cert-avatar" style={{ background: `${accent}22`, color: accent }}>
                        {cert.certName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="manage-cert-name">{cert.certName}</p>
                        <p className="manage-cert-org">{cert.orgName}</p>
                      </div>
                    </div>

                    <div className="manage-cert-dates">
                      <div className="manage-cert-date-item">
                        <span className="manage-cert-date-label">Issued</span>
                        <span className="manage-cert-date-value">{cert.issueDate}</span>
                      </div>
                      <div className="manage-cert-date-sep">→</div>
                      <div className="manage-cert-date-item">
                        <span className="manage-cert-date-label">Expires</span>
                        <span className="manage-cert-date-value">{cert.expiryDate}</span>
                      </div>
                    </div>

                    <div className="manage-cert-validity">
                      <div className={`manage-cert-validity-badge validity-${validity.type}`}>
                        {validity.label}
                      </div>
                      <div className="manage-cert-validity-bar">
                        <div
                          className={`manage-cert-validity-fill validity-fill-${validity.type}`}
                          style={{ width: `${validity.pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="manage-cert-actions">
                      <button
                        className="manage-cert-btn manage-cert-btn-dl"
                        onClick={() => handleDownload(cert.id, cert.certName)}
                        disabled={downloadingId === cert.id}
                        title="Download"
                      >
                        {downloadingId === cert.id ? '⏳' : '↓'}
                      </button>
                      <button
                        className="manage-cert-btn manage-cert-btn-edit"
                        onClick={() => navigate(`/user/update-certificate/${cert.certName}`)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="manage-cert-btn manage-cert-btn-del"
                        onClick={() => handleDelete(cert.certName, cert.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewCertificates;
