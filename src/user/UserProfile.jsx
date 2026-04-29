import { useEffect, useState } from 'react';
import UserNavBar from './UserNavBar';
import { getUserByUsername, updateUserProfile } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const FIELD_ICONS = { name: '👤', gender: '⚧', email: '✉️', username: '🔖', Contact: '📞' };
const FIELD_LABELS = { name: 'Full Name', gender: 'Gender', email: 'Email Address', username: 'Username', Contact: 'Contact Number' };

const DEMO_PROFILE = {
  id: 7,
  name: '2400030220',
  gender: 'Male',
  email: '2400030220@kluniversity.in',
  username: 'user',
  Contact: '6303145115'
};

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(DEMO_PROFILE);
  const [formData, setFormData] = useState({ id: DEMO_PROFILE.id, name: DEMO_PROFILE.name });

  useEffect(() => {
    if (!user?.username) return;
    getUserByUsername(user.username)
      .then(data => {
        const p = {
          id: data?.id || DEMO_PROFILE.id,
          name: data?.name || DEMO_PROFILE.name,
          gender: data?.gender || DEMO_PROFILE.gender,
          email: data?.email || DEMO_PROFILE.email,
          username: data?.username || DEMO_PROFILE.username,
          Contact: data?.Contact || data?.contact || DEMO_PROFILE.Contact
        };
        setProfileData(p);
        setFormData({ id: p.id, name: p.name });
      })
      .catch(() => {});
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { id: formData.id, name: formData.name };
      const response = await updateUserProfile(payload);
      setProfileData(prev => ({ ...prev, ...payload }));
      setIsEditing(false);
      toast.success(response);
    } catch (error) {
      toast.error(error.response?.data || 'Update failed');
    }
  };

  const initials = (profileData.name || profileData.username || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="user-page user-page-profile">
      <UserNavBar />
      <div className="user-shell">

        <div className="profile-layout">

          {/* ── Left: Identity card ── */}
          <aside className="profile-identity-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-avatar-ring" />
            </div>
            <h2 className="profile-display-name">{profileData.name || '—'}</h2>
            <p className="profile-display-username">@{profileData.username || '—'}</p>
            <div className="profile-badge-row">
              <span className="profile-badge">Certified User</span>
            </div>
            <div className="profile-identity-divider" />
            <div className="profile-meta-list">
              {['email', 'gender'].map(key => (
                <div key={key} className="profile-meta-item">
                  <span className="profile-meta-icon">{FIELD_ICONS[key]}</span>
                  <div>
                    <p className="profile-meta-label">{FIELD_LABELS[key]}</p>
                    <p className="profile-meta-value">{profileData[key] || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right: Details + edit ── */}
          <div className="profile-details-panel">

            <div className="profile-panel-header">
              <h3 className="profile-panel-title">Account Details</h3>
              {!isEditing && (
                <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                  ✎ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-info-grid">
                {['name', 'username', 'email', 'Contact', 'gender'].map(key => (
                  <div key={key} className="profile-info-tile">
                    <span className="profile-info-icon">{FIELD_ICONS[key]}</span>
                    <div>
                      <p className="profile-info-label">{FIELD_LABELS[key]}</p>
                      <p className="profile-info-value">{profileData[key] || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <p className="profile-edit-note">
                  Only <strong>Full Name</strong> can be updated. All other fields are read-only.
                </p>

                <div className="profile-edit-fields" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="profile-edit-field">
                    <label>
                      <span className="profile-edit-field-icon">👤</span> Full Name
                    </label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} required className="user-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="profile-readonly-fields">
                  <p className="profile-readonly-label">Read-only fields</p>
                  <div className="profile-readonly-row">
                    <div className="profile-readonly-item">
                      <span>✉️</span>
                      <div>
                        <p className="profile-info-label">Email</p>
                        <p className="profile-info-value">{profileData.email || '—'}</p>
                      </div>
                    </div>
                    <div className="profile-readonly-item">
                      <span>🔖</span>
                      <div>
                        <p className="profile-info-label">Username</p>
                        <p className="profile-info-value">{profileData.username || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-edit-actions">
                  <button type="submit" className="user-btn user-btn-primary">Save Changes</button>
                  <button
                    type="button"
                    className="user-btn user-btn-secondary"
                    onClick={() => {
                      setFormData({ id: profileData.id, name: profileData.name });
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
