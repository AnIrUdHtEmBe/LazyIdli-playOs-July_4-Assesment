import React from 'react';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          Customer Assessment
        </h1>
      </div>
    </header>
  );
};

export default Header;
