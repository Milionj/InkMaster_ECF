import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 InkMaster. Tous Droits Réservés.</p>
      <div className="footer-links">
        <a
          href="https://www.instagram.com/ton_compte"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.pinterest.com/ton_compte"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pinterest
        </a>
      </div>
    </footer>
  );
};

export default Footer;
