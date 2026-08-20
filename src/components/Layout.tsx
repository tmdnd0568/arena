import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import BrandPanel from './BrandPanel';
import Header from './Header';
import BottomTabbar from './BottomTabbar';
import MenuDrawer from './MenuDrawer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 60px rgba(0, 43, 73, 0.12);

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
  height: 100vh; /* 고정 높이로 ServiceMain의 overflow:auto가 정상 동작하도록 */
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

/* 헤더를 ServiceMain 내부로 포함 — sticky가 ServiceMain의 scroll context 안에서 동작하도록 */
const ServiceMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto; /* 이 컨테이너가 단일 스크롤 컨텍스트 */
  overflow-x: hidden;
  padding-bottom: 84px; /* 하단 탭바 높이 대응 */

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
  background: white; /* mix-blend-mode:multiply 적용된 이미지와 합성되지 않도록 */
  isolation: isolate; /* 새 stacking context를 생성하여 blend mode 격리 */
`;

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <LayoutContainer className="layout">
      {/* 좌측 70% 브랜드 패널 (데스크탑에서만 보임) */}
      <BrandPanel />

      {/* 우측 30% 서비스 패널 (모바일에서는 전체 화면) */}
      <ServicePanel className="service-panel">
        {/* 본문 콘텐츠 스크롤 영역 — 헤더도 이 안에 포함하여 sticky가 scroll context 안에서 동작 */}
        <ServiceMain className="service-main">
          {/* 헤더: sticky top:0 으로 스크롤해도 상단 고정 */}
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
