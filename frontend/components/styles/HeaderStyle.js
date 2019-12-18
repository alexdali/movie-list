import styled from 'styled-components';

const HeaderDiv = styled.div`
  background: #fff;
  width: 100%;
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: absolute;
  top: 0;
  .home-page {
    height: 100%;
    max-width: 1200px;
    position: relative;
    margin: auto;
    .logo {
    float: left;
    margin: 0 25px 0;
    cursor: pointer;
    }
    img {
      width: 4rem;
      margin-top: 0.5rem;
    }
  }
  .ui.floated.header {
  }
  .ui.menu {
    font-family: 'Montserrat Alternates', 'Roboto', 'Open Sans', sans-serif,
      'Arial';
  }
  .ui.right.floated.menu {
    margin: 0.8rem 2rem 0 0.5rem;
  }
  .ui.secondary.menu .dropdown.item:hover,
  .ui.secondary.menu .link.item:hover,
  .ui.secondary.menu a.item:hover {
    background: none;
  }
  .MenuItem {
    cursor: pointer;
    &:after {
      height: 2px;
      background: #;
      content: '';
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 0.5rem;
    }
    &:hover,
    &:focus {
      background: none;
      outline: none;
      color: #;
      font-weight: 600;
      &:after {
        width: calc(100% - 10px);
      }
      @media (max-width: 700px) {
        width: calc(100% - 10px);
      }
    }
    a {
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      position: relative;
      background: none;
      border: 0;
      cursor: pointer;
      @media (max-width: 700px) {
        padding: 0 10px;
      }
    }
  }
`;

export default HeaderDiv;
