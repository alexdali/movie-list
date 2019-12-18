import React from 'react';
import Link from 'next/link';
import NavBar from './NavBar';
import HeaderDiv from './styles/HeaderStyle';

const HeaderBar = () => (
      <HeaderDiv>
        <div className="home-page">
          <header className="logo">
            <Link href="/">
              <img src="/logo.png" alt="logo" />
            </Link>
          </header>
          <NavBar />
        </div>
      </HeaderDiv>
);

export default HeaderBar;
