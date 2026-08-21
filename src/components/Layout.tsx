import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BrandPanel from './BrandPanel';
import Header from './Header';
import BottomTabbar from './BottomTabbar';
import MenuDrawer from './MenuDrawer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};

  @media ${({ theme }) => theme.media.desktop} {
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
  }
`;

const ServicePanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;

  @media ${({ theme }) => theme.media.desktop} {
    width: 30%;
    flex: 0 0 30%;
    height: 100vh;
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
    position: relative;
  }
`;

const ServiceMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 84px;

  @media ${({ theme }) => theme.media.desktop} {
    padding-bottom: 88px;
    position: relative;
    z-index: 1;
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
  background: white;
  isolation: isolate;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  font-size: 16px;
  color: #64798a;
  background: #f8fafc;
`;

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading } = useApp();

  // 1. Firebase Auth 상태 로딩 중일 때는 로딩 표시
  if (loading) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  // 2. 로그인되지 않았을 경우에는 전체화면 로그인 페이지로 대체
  return (
    <LayoutContainer className="layout">
      {/* 좌측 70% 브랜드 패널 (데스크탑에서만 보임) */}
      <BrandPanel />

      {/* 우측 30% 서비스 패널 (모바일에서는 전체 화면) */}
      <ServicePanel className="service-panel">
        {/* 본문 콘텐츠 스크롤 영역 */}
        <ServiceMain className="service-main">
          {/* 헤더: sticky top:0 으로 고정 */}
          <StickyHeader>
            <Header onMenuOpen={() => setIsMenuOpen(true)} />
          </StickyHeader>

          <Outlet />
        </ServiceMain>

        {/* 하단 탭바 */}
        <BottomTabbar />

        {/* 모바일 햄버거 메뉴 사이드바 */}
        <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </ServicePanel>
    </LayoutContainer>
  );
};

export default Layout;
