import React from 'react'

const Navbar = () => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="#" className="nav__logo">
          <i className="ri-steering-line"></i> ClaimTheia
        </a>
        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item"><a href="#home" className="nav__link active-link">Home</a></li>
            <li className="nav__item"><a href="#about" className="nav__link">About</a></li>
            <li className="nav__item"><a href="#popular" className="nav__link">Request a quote</a></li>
            <li className="nav__item"><a href="#featured" className="nav__link">Services</a></li>
          </ul>
          <div className="nav__close" id="nav-close"><i className="ri-close-line"></i></div>
        </div>
        <div className="nav__toggle" id="nav-toggle"><i className="ri-menu-line"></i></div>
      </nav>
    </header>
  )
}

export default Navbar


