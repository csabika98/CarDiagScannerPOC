import React from 'react'

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="footer__container container grid">
        <div className="footer__content">
          <a href="#" className="footer__logo"><i className="ri-steering-line"></i> ClaimTheia</a>
          <p className="footer__description">
            We offer the best claims <br /> management for your cars.
          </p>
        </div>
        <div className="footer__content">
          <h3 className="footer__title" style={{display:'contents'}}>Company</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">About</a></li>
            <li><a href="#" className="footer__link">Cars</a></li>
            <li><a href="#" className="footer__link">History</a></li>
            <li><a href="#" className="footer__link">Shop</a></li>
          </ul>
        </div>
        <div className="footer__content">
          <h3 className="footer__title" style={{display:'contents'}}>Follow us</h3>
          <ul className="footer__social">
            <li><a href="https://www.facebook.com/" className="footer__social-link">Facebook</a></li>
            <li><a href="https://www.instagram.com/" className="footer__social-link">Instagram</a></li>
            <li><a href="https://twitter.com/" className="footer__social-link">Twitter</a></li>
          </ul>
        </div>
      </div>
      <span className="footer__copy">&#169; ClaimTheia 2025. All rights reserved</span>
    </footer>
  )
}

export default Footer


