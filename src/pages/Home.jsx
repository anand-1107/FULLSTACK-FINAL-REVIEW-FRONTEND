import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import Footer from '../components/Footer';
import { getAllCertificates, getAllUsers } from '../api/admin';
import './Home.css';
import certCloud from '../assets/certificate-cloud.svg';
import certCyber from '../assets/certificate-cyber.svg';
import certData from '../assets/certificate-data.svg';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: null,
    certificates: null,
    validCertificates: null,
    expiredCertificates: null,
  });

  const formatCompact = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchLandingStats = async () => {
      const [usersResult, certificatesResult] = await Promise.allSettled([
        getAllUsers(),
        getAllCertificates(),
      ]);

      let validCertificatesCount = null;
      let expiredCertificatesCount = null;
      if (certificatesResult.status === 'fulfilled' && Array.isArray(certificatesResult.value)) {
        const today = new Date();
        validCertificatesCount = certificatesResult.value.filter((cert) => {
          if (!cert?.expiryDate) return false;
          const expiry = new Date(cert.expiryDate);
          if (Number.isNaN(expiry.getTime())) return false;
          return expiry >= today;
        }).length;

        expiredCertificatesCount = certificatesResult.value.filter((cert) => {
          if (!cert?.expiryDate) return false;
          const expiry = new Date(cert.expiryDate);
          if (Number.isNaN(expiry.getTime())) return false;
          return expiry < today;
        }).length;
      }

      const nextStats = {
        users: usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)
          ? usersResult.value.length
          : null,
        certificates: certificatesResult.status === 'fulfilled' && Array.isArray(certificatesResult.value)
          ? certificatesResult.value.length
          : null,
        validCertificates: validCertificatesCount,
        expiredCertificates: expiredCertificatesCount,
      };

      setStats(nextStats);
    };

    fetchLandingStats();
  }, []);

  const handleCertificateMouseMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const rotateY = ((offsetX / rect.width) - 0.5) * 6;
    const rotateX = ((offsetY / rect.height) - 0.5) * -6;

    card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--card-lift', '-5px');
  };

  const handleCertificateMouseLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty('--card-rotate-x', '0deg');
    card.style.setProperty('--card-rotate-y', '0deg');
    card.style.setProperty('--card-lift', '0px');
  };

  return (
    <div className="home-page">
      <MainNavBar />

      {/* ── HERO – full-width banner with centered content ── */}
      <section className="home-hero" data-reveal>
        <div className="home-ambient home-ambient-left" aria-hidden="true" />
        <div className="home-ambient home-ambient-right" aria-hidden="true" />

        <div className="home-container">
          {/* top eyebrow */}
          <div className="home-hero-eyebrow">
            {(stats.users !== null || stats.certificates !== null) && (
              <div className="home-trust-badge">
                {stats.users !== null ? `${formatCompact(stats.users)} active users` : ''}
                {stats.users !== null && stats.certificates !== null ? ' • ' : ''}
                {stats.certificates !== null ? `${formatCompact(stats.certificates)} certifications tracked` : ''}
              </div>
            )}
          </div>

          {/* centered headline */}
          <div className="home-hero-center">
            <h1>Your Professional Certifications,<br />Organised in One Place</h1>
            <p>
              Stay ahead of renewals, track every credential, and never let an
              important certification slip through the cracks.
            </p>
            <div className="home-hero-actions">
              <button onClick={() => navigate('/register')} className="home-btn home-btn-primary">
                Get Started Free
              </button>
              <button onClick={() => navigate('/login')} className="home-btn home-btn-outline">
                Sign In
              </button>
            </div>
            <div className="home-hero-checks">
              <span>No credit card required</span>
              <span>Free forever plan</span>
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* inline stats strip */}
          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <span className="home-hero-stat-icon">👥</span>
              <span className="home-hero-stat-value">{formatCompact(stats.users)}</span>
              <span className="home-hero-stat-label">Active Users</span>
            </div>
            <div className="home-hero-stat-divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat-icon">📜</span>
              <span className="home-hero-stat-value">{formatCompact(stats.certificates)}</span>
              <span className="home-hero-stat-label">Certs Tracked</span>
            </div>
            <div className="home-hero-stat-divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat-icon">✅</span>
              <span className="home-hero-stat-value">{stats.validCertificates ?? 'N/A'}</span>
              <span className="home-hero-stat-label">Valid Certs</span>
            </div>
            <div className="home-hero-stat-divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat-icon">⏳</span>
              <span className="home-hero-stat-value">{stats.expiredCertificates ?? 'N/A'}</span>
              <span className="home-hero-stat-label">Expired Certs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST TICKER – horizontal pill row ── */}
      <section className="home-trust-rail" data-reveal>
        <div className="home-container home-trust-grid">
          <div className="home-trust-card">🛡️ Enterprise-ready certificate governance</div>
          <div className="home-trust-card">⚡ Automated expiry intelligence and reminders</div>
          <div className="home-trust-card">🔒 Secure document vault with role-based access</div>
        </div>
      </section>

      {/* ── GALLERY – featured large + two side cards ── */}
      <section className="home-gallery" data-reveal>
        <div className="home-container">
          <div className="home-section-label">Portfolio Preview</div>
          <h2>See Your Certificates Come Alive</h2>
          <p className="home-section-subtitle">
            Every credential beautifully displayed with status, issuer, and renewal timeline.
          </p>

          <div className="home-gallery-grid">
            {/* featured card – large */}
            <article
              className="home-gallery-card home-gallery-card-featured"
              onMouseMove={handleCertificateMouseMove}
              onMouseLeave={handleCertificateMouseLeave}
            >
              <img src={certCloud} alt="Cloud Architect certificate preview" loading="lazy" />
              <div className="home-gallery-content">
                <span className="home-gallery-issuer">Amazon Web Services</span>
                <h3>AWS Solutions Architect</h3>
                <p>Professional level cloud architecture certification covering design, deployment and management of AWS infrastructure.</p>
                <span className="home-gallery-tag">✓ Valid till Dec 2027</span>
              </div>
            </article>

            {/* side stack */}
            <div className="home-gallery-side">
              <article
                className="home-gallery-card home-gallery-card-side"
                onMouseMove={handleCertificateMouseMove}
                onMouseLeave={handleCertificateMouseLeave}
              >
                <img src={certCyber} alt="Cybersecurity Analyst certificate preview" loading="lazy" />
                <div className="home-gallery-content">
                  <span className="home-gallery-issuer">EC-Council Academy</span>
                  <h3>Cybersecurity Analyst</h3>
                  <span className="home-gallery-tag home-gallery-tag-warning">⚠ Renew in 38 days</span>
                </div>
              </article>

              <article
                className="home-gallery-card home-gallery-card-side"
                onMouseMove={handleCertificateMouseMove}
                onMouseLeave={handleCertificateMouseLeave}
              >
                <img src={certData} alt="Data Engineering Professional certificate preview" loading="lazy" />
                <div className="home-gallery-content">
                  <span className="home-gallery-issuer">Google Cloud Skills</span>
                  <h3>Data Engineering Professional</h3>
                  <span className="home-gallery-tag">✓ Valid till Jul 2028</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES – numbered horizontal steps ── */}
      <section className="home-features" data-reveal>
        <div className="home-container">
          <div className="home-section-label">Why CertTracker</div>
          <h2>Everything You Need to Stay Certified</h2>
          <p className="home-section-subtitle">
            Three powerful tools that keep your professional credentials always in order.
          </p>
          <div className="home-feature-grid">
            <div className="home-feature-card">
              <div className="home-feature-step">01</div>
              <div className="home-feature-icon">📋</div>
              <h3>Track Certification Details</h3>
              <p>
                Keep all your professional certifications organized in one secure place
                with detailed information.
              </p>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-step">02</div>
              <div className="home-feature-icon">⏰</div>
              <h3>Monitor Expiry Dates</h3>
              <p>
                Never miss a renewal deadline with our intelligent expiry date tracking
                system.
              </p>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-step">03</div>
              <div className="home-feature-icon">🔔</div>
              <h3>Get Renewal Reminders</h3>
              <p>
                Receive timely notifications before your certifications expire to stay
                ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta" data-reveal>
        <div className="home-container">
          <div className="home-cta-card">
            <h2>Ready to Take Control of Your Certifications?</h2>
            <p>Join thousands of professionals who never miss a renewal deadline.</p>
            <button onClick={() => navigate('/register')} className="home-btn home-btn-primary">
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
