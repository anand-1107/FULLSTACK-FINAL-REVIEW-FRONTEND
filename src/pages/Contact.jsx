import MainNavBar from '../components/MainNavBar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainNavBar />
      <div style={{ flex: 1, padding: '60px 5%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '20px', color: '#667eea' }}>Contact Us</h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#666', marginBottom: '30px' }}>Get in touch with us</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p>📧 certtracker@gmail.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Hyderabad, Telangana, India</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
