import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TabbarContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: transparent;
  z-index: 100;
  pointer-events: none;

  @media ${({ theme }) => theme.media.desktop} {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  border-top: none;
  pointer-events: auto;
  box-shadow: none;

  @media ${({ theme }) => theme.media.desktop} {
    max-width: 100%;
  }
`;

const TabItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.cyanDark : theme.colors.textFaint)};
  transition: color 0.15s;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.cyanDark};
  }

  svg {
    width: 24px;
    height: 24px;
  }

  .cart-badge {
    position: absolute;
    top: 4px;
    right: 2px;
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

const BottomTabbar: React.FC = () => {
  const { pathname } = useLocation();
  const { cartCount, t } = useApp();

  return (
    <TabbarContainer className="bottom-tabbar" aria-label={t('home')}>
      <Nav className="bottom-tabbar__nav">
        {/* 홈 탭 */}
        <TabItem to="/" $isActive={pathname === '/'} aria-label={t('home')}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 12L12 3L21 12V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </TabItem>

        {/* 검색/상품 목록 탭 */}
        <TabItem to="/products" $isActive={pathname === '/products'} aria-label={t('search')}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </TabItem>

        {/* 장바구니 탭 */}
        <TabItem to="/basket" $isActive={pathname === '/basket'} aria-label={t('basket')}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.8" strokeLinecap="round" />
            <path
              d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </TabItem>

        {/* 마이페이지 탭 */}
        <TabItem to="/myself" $isActive={pathname === '/myself'} aria-label={t('mypage')}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 20C4 17.23 7.58 15 12 15C16.42 15 20 17.23 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </TabItem>
      </Nav>
    </TabbarContainer>
  );
};

export default BottomTabbar;
