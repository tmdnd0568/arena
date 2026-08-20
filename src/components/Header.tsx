import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MenuButton = styled.button`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .logo-img {
    height: 20px;
    object-fit: contain;
    mix-blend-mode: multiply;
  }
`;

const CartLink = styled(Link)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }

  .cart-badge {
    position: absolute;
    top: -4px;
    right: -6px;
    background-color: #ef4444;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 50%;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 1.5px solid #fff;
    box-sizing: border-box;
  }
`;

interface HeaderProps {
  onMenuOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuOpen }) => {
  const { cartCount } = useApp();

  return (
    <HeaderContainer className="service-header">
      {/* 메뉴 열기 버튼 */}
      <MenuButton onClick={onMenuOpen} aria-label="메뉴 열기">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </MenuButton>

      {/* 로고 */}
      <LogoLink to="/">
        <img src="/images/arena_02.png" alt="ARENA 로고" className="logo-img logo-img--sm" />
      </LogoLink>

      {/* 장바구니 바로가기 */}
      <CartLink to="/basket" aria-label="장바구니">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </CartLink>
    </HeaderContainer>
  );
};

export default Header;
