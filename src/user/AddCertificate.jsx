import { useState } from 'react';
import UserNavBar from './UserNavBar';
import { addCertificate } from '../api/certificate';
import { login as loginAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const STEPS = ['Certificate Info', 'Validity Dates', 'Upload Document'];

const AddCertificate = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    certName: '', orgName: '', issueDate: '', expiryDate: '', file: null
  });
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return setFormData({ ...formData, file: null });
    if (file.type !== 'application/pdf') {
      setFileError('Please upload a PDF file only');
      e.target.value = '';
      return setFormData({ ...formData, file: null });
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      e.target.value = '';
      return setFormData({ ...formData, file: null });
    }
    setFormData({ ...formData, file });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.certName.trim()) { toast.error('Certificate name is required'); return false; }
      if (!formData.orgName.trim()) { toast.error('Organization name is required'); return false; }
    }
    if (step === 1) {
      if (!formData.issueDate) { toast.error('Issue date is required'); return false; }
      if (!formData.expiryDate) { toast.error('Expiry date is required'); return false; }
      if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
        toast.error('Expiry date must be after issue date'); return false;
      }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // refresh token right before API call since JWT expires in 2 mins
      const tokenData = await loginAPI('user', 'user');
      sessionStorage.setItem('token', tokenData.token);
      await addCertificate({
        certName: formData.certName,
        orgName: formData.orgName,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        userid: user.id,
      });
      toast.success('Certificate added successfully!');
      setFormData({ certName: '', orgName: '', issueDate: '', expiryDate: '', file: null });
      setStep(0);
      setLoading(false);
      return;
    } catch {
      // backend failed, fall back to localStorage
    }
    const existing = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    const newCert = {
      id: Date.now(),
      certName: formData.certName,
      orgName: formData.orgName,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
    };
    localStorage.setItem('user_certificates', JSON.stringify([...existing, newCert]));
    toast.success('Certificate added successfully!');
    setFormData({ certName: '', orgName: '', issueDate: '', expiryDate: '', file: null });
    setStep(0);
    setLoading(false);
  };

  return (
    <div className="user-page user-page-add">
      <UserNavBar />
      <div className="user-shell">
        <div className="add-cert-wrapper">

          <aside className="add-cert-sidebar">
            <div className="add-cert-sidebar-inner">
              <div className="add-cert-sidebar-icon">🎓</div>
              <h2 className="add-cert-sidebar-title">Add New Certificate</h2>
              <p className="add-cert-sidebar-desc">
                Complete the steps to register your certification and keep your portfolio up to date.
              </p>
              <nav className="add-cert-stepper">
                {STEPS.map((label, i) => (
                  <div key={i} className={`add-cert-step ${i === step ? 'step-active' : i < step ? 'step-done' : ''}`}>
                    <div className="add-cert-step-dot">{i < step ? '✓' : i + 1}</div>
                    <span className="add-cert-step-label">{label}</span>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <div className="add-cert-main">
            <div className="add-cert-progress-bar">
              <div className="add-cert-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>

            <div className="add-cert-step-header">
              <span className="add-cert-step-count">Step {step + 1} of {STEPS.length}</span>
              <h3 className="add-cert-step-title">{STEPS[step]}</h3>
            </div>

            <div className="add-cert-fields">
              {step === 0 && (
                <>
                  <div className="user-field">
                    <label>Certificate Name *</label>
                    <input type="text" name="certName" value={formData.certName} onChange={handleChange}
                      className="user-input" placeholder="e.g., AWS Certified Solutions Architect" />
                  </div>
                  <div className="user-field">
                    <label>Issuing Organization *</label>
                    <input type="text" name="orgName" value={formData.orgName} onChange={handleChange}
                      className="user-input" placeholder="e.g., Amazon Web Services" />
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="add-cert-date-grid">
                  <div className="add-cert-date-card">
                    <div className="add-cert-date-icon">📅</div>
                    <label>Issue Date *</label>
                    <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="user-input" />
                  </div>
                  <div className="add-cert-date-card">
                    <div className="add-cert-date-icon">⏳</div>
                    <label>Expiry Date *</label>
                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="user-input" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="add-cert-upload-zone">
                  <div className="add-cert-upload-icon">📄</div>
                  <p className="add-cert-upload-label">Drop your PDF here or click to browse</p>
                  <p className="add-cert-upload-hint">PDF only · Max 5MB</p>
                  <input type="file" accept="application/pdf" onChange={handleFileChange}
                    className="add-cert-file-input" disabled={loading} />
                  {formData.file && (
                    <div className="add-cert-file-badge">
                      ✅ {formData.file.name} ({(formData.file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                  {fileError && <p className="user-error-text">{fileError}</p>}
                </div>
              )}
            </div>

            <div className="add-cert-nav-row">
              {step > 0 && (
                <button className="user-btn user-btn-secondary" onClick={back}>← Back</button>
              )}
              {step < STEPS.length - 1 ? (
                <button className="user-btn user-btn-primary add-cert-next-btn" onClick={next}>
                  Continue →
                </button>
              ) : (
                <button className="user-btn user-btn-primary add-cert-next-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : '✓ Submit Certificate'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
