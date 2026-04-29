const LandingPage = ({ onLoginClick }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, width: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 'bold' }}>🎓 CertTracker</div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={onLoginClick} style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '14px' }}>Login</button>
          <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '14px' }}>Register</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 5%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', marginBottom: '10px' }}>✨Trusted by 10,000+ Professionals</div>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 48px)', margin: '20px 0', lineHeight: '1.2' }}>Track and Manage Your Professional Certifications</h1>
        <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', marginBottom: '30px', maxWidth: '800px', margin: '0 auto 30px' }}>Stay organized and never miss a certification renewal. Keep your career credentials up-to-date with our intelligent tracking platform.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={{ padding: '15px 30px', fontSize: 'clamp(14px, 2vw, 16px)', cursor: 'pointer', background: 'white', color: '#667eea', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Get Started Free</button>
          <button style={{ padding: '15px 30px', fontSize: 'clamp(14px, 2vw, 16px)', cursor: 'pointer', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '5px' }}>🎥 Watch Demo</button>
        </div>
        <div style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>
          <div>✅ No credit card required</div>
          <div>✅ Free forever plan</div>
          <div>✅ Cancel anytime</div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '30px', padding: '50px 5%', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#667eea' }}>10K+</div>
          <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>Active Users</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#667eea' }}>50K+</div>
          <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>Certifications Tracked</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#667eea' }}>99.9%</div>
          <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>Uptime</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#667eea' }}>24/7</div>
          <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>Support</div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '10px' }}>Why Choose Our Platform?</h2>
        <p style={{ color: '#666', marginBottom: '50px', fontSize: 'clamp(14px, 2vw, 16px)' }}>Everything you need to manage your professional certifications</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Track Certification Details</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Keep all your professional certifications organized in one secure place with detailed information.</p>
          </div>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⏰</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Monitor Expiry Dates</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Never miss a renewal deadline with our intelligent expiry date tracking system.</p>
          </div>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔔</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Get Renewal Reminders</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Receive timely notifications before your certifications expire to stay ahead.</p>
          </div>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔒</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Store Certificates Securely</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Upload and store your certificate documents safely with encrypted cloud storage.</p>
          </div>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Analytics & Reports</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Get detailed insights and reports on your certification portfolio and renewal trends.</p>
          </div>
          <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌐</div>
            <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '10px' }}>Multi-Platform Access</h3>
            <p style={{ color: '#666', fontSize: 'clamp(13px, 2vw, 15px)' }}>Access your certifications anytime, anywhere from any device with cloud synchronization.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '60px 5%', background: '#f8f9fa', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '10px' }}>What Our Users Say</h2>
        <p style={{ color: '#666', marginBottom: '50px', fontSize: 'clamp(14px, 2vw, 16px)' }}>Join thousands of satisfied professionals</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div style={{ padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👩💼</div>
            <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: 'clamp(13px, 2vw, 15px)' }}>"This platform has made managing my team's certifications so much easier. No more missed renewals!"</p>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 16px)' }}>Sarah Johnson</div>
            <div style={{ color: '#666', fontSize: 'clamp(12px, 1.8vw, 14px)' }}>IT Manager</div>
          </div>
          <div style={{ padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👨💻</div>
            <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: 'clamp(13px, 2vw, 15px)' }}>"Simple, intuitive, and reliable. Exactly what I needed to keep track of my professional certifications."</p>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 16px)' }}>Michael Chen</div>
            <div style={{ color: '#666', fontSize: 'clamp(12px, 1.8vw, 14px)' }}>Software Engineer</div>
          </div>
          <div style={{ padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👩💼</div>
            <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: 'clamp(13px, 2vw, 15px)' }}>"The analytics and reporting features are outstanding. Highly recommend for any organization."</p>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 16px)' }}>Emily Davis</div>
            <div style={{ color: '#666', fontSize: 'clamp(12px, 1.8vw, 14px)' }}>HR Director</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: 'center', padding: '60px 5%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '20px' }}>Ready to Get Started?</h2>
        <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', marginBottom: '30px' }}>Join thousands of professionals managing their certifications efficiently</p>
        <button style={{ padding: '15px 40px', fontSize: 'clamp(14px, 2.5vw, 18px)', cursor: 'pointer', background: 'white', color: '#667eea', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Start Free Today</button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '50px 5%', background: '#2c3e50', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '15px', fontSize: 'clamp(16px, 2.5vw, 20px)' }}>🎓 Certification Tracker</h3>
            <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: '#bbb', lineHeight: '1.6' }}>Your trusted platform for managing professional certifications. Keep track of your credentials, monitor expiry dates, and never miss a renewal deadline.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              <a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Features</a>
              <a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>About Us</a>
              <a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Pricing</a>
              <a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>FAQ</a>
              <a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Contact Us</a>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '10px', fontSize: 'clamp(12px, 2vw, 14px)' }}>📧 certtracker@gmail.com</div>
            <div style={{ marginBottom: '10px', fontSize: 'clamp(12px, 2vw, 14px)' }}>📞 +91 98765 43210</div>
            <div style={{ marginBottom: '15px', fontSize: 'clamp(12px, 2vw, 14px)' }}>📍 Hyderabad, Telangana, India</div>
            <div>
              <h4 style={{ marginBottom: '10px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '10px', fontSize: '20px' }}>
                <span style={{ cursor: 'pointer' }}>🔵</span>
                <span style={{ cursor: 'pointer' }}>🐦</span>
                <span style={{ cursor: 'pointer' }}>💼</span>
                <span style={{ cursor: 'pointer' }}>📷</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #444', fontSize: 'clamp(11px, 2vw, 14px)', color: '#bbb' }}>
          © 2026 Certification Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
