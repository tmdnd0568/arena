import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BrandPanelContainer = styled.section`
  display: none;

  @media ${({ theme }) => theme.media.desktop} {
    display: flex;
    position: relative;
    overflow: hidden;
    width: 70%;
    flex: 0 0 70%;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    background: ${({ theme }) => theme.colors.bgSoft};
    padding: clamp(28px, 3vw, 40px) clamp(32px, 5vw, 64px) clamp(36px, 4vw, 56px);
  }

  @media ${({ theme }) => theme.media.tablet} {
    padding: clamp(36px, 4vw, 48px) clamp(48px, 6vw, 72px) clamp(48px, 5vw, 64px);
  }

  @media ${({ theme }) => theme.media.largeDesktop} {
    padding: 40px 72px 60px;
  }
`;

const DecoCircle = styled.div<{ $type: 'cyan' | 'light' | 'navy' }>`
  position: absolute;
  border-radius: 50%;
  z-index: 0;

  ${({ $type, theme }) =>
    $type === 'cyan' &&
    `
      width: 150px;
      height: 150px;
      left: -75px;
      top: 40%;
      transform: translateY(-50%);
      background: ${theme.colors.cyan};
    `}

  ${({ $type }) =>
    $type === 'light' &&
    `
      width: 260px;
      height: 260px;
      right: -80px;
      top: -80px;
      background: rgba(191, 232, 247, 0.80);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    `}

  ${({ $type }) =>
    $type === 'navy' &&
    `
      width: 130px;
      height: 130px;
      right: -40px;
      top: 95px;
      background: rgba(2, 43, 73, 0.90);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    `}
`;

const LogoWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.navy};
  font-weight: 800;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  letter-spacing: -0.02em;

  .logo-img {
    height: 32px; /* 로고 이미지 높이 고정 */
    object-fit: contain;
    mix-blend-mode: multiply;
    filter: brightness(0); /* 로고 이미지 색상을 완전한 검정색으로 변환 */
  }
`;

const BodySection = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 2.2vw, 26px);
  width: 100%;
  padding: clamp(24px, 3vw, 40px) 0;
`;

const VisualCircle = styled.div`
  align-self: center;
  width: clamp(220px, 27vw, 310px);
  height: clamp(220px, 27vw, 310px);
  max-width: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 28%,
    #4fd8ff 0%,
    ${({ theme }) => theme.colors.cyan} 38%,
    ${({ theme }) => theme.colors.navyLight} 78%,
    ${({ theme }) => theme.colors.navy} 100%
  );
  box-shadow: 0 8px 32px rgba(0, 43, 73, 0.18);
  position: relative;
  overflow: hidden;

  .visual-ring {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    pointer-events: none;
    z-index: 1;
  }

  .visual-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }
`;

const ContentWrapper = styled.div`
  align-self: center;
  width: clamp(220px, 27vw, 310px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(12px, 1.8vw, 20px);
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  line-height: 1.3;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.navy};
  letter-spacing: -0.01em;
  text-align: left;
  white-space: nowrap;

  .title-en {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-weight: 400;
    color: ${({ theme }) => theme.colors.navyLight};
    display: block;
    white-space: nowrap;
  }

  @media ${({ theme }) => theme.media.largeDesktop} {
    font-size: clamp(2rem, 2.8vw, 2.8rem);
  }
`;

const SubCopy = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 300;
  font-size: clamp(0.85rem, 1.2vw, 1.063rem);
  line-height: 1.6;
  color: #000000;
  text-align: left;
  white-space: nowrap;
`;

const IntroBadges = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-align: left;

  span {
    font-size: clamp(0.72rem, 1.3vw, 0.8rem);
    font-weight: 600;
    color: ${({ theme }) => theme.colors.cyanDark};
    background: rgba(0, 208, 255, 0.08);
    padding: 6px 14px;
    border-radius: ${({ theme }) => theme.radii.pill};
    display: inline-block;
  }
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: 2px solid ${({ theme }) => theme.colors.navy};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: clamp(0.85rem, 1.1vw, 0.938rem);
  color: ${({ theme }) => theme.colors.navy};
  transition: background 0.2s ease, color 0.2s ease;
  text-decoration: none !important;

  &:hover {
    background: ${({ theme }) => theme.colors.navy};
    color: ${({ theme }) => theme.colors.white};
  }

  .icon-chevron {
    width: 15px;
    height: 15px;
  }
`;

const EventWrapper = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  .event-text {
    font-size: clamp(0.82rem, 1vw, 0.938rem);
    color: ${({ theme }) => theme.colors.text};
    text-align: left;

    strong {
      color: ${({ theme }) => theme.colors.cyanDark};
      font-weight: 800;
    }
  }
`;

const StoreButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const StoreButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.15s, box-shadow 0.15s;
  text-decoration: none !important;

  &:hover {
    border-color: ${({ theme }) => theme.colors.navy};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  .store-icon {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.navy};
    flex-shrink: 0;
  }

  .store-text {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.4;
    text-align: left;

    strong {
      color: ${({ theme }) => theme.colors.navy};
      font-size: 13px;
    }
  }
`;

const IllustrationWrapper = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 0;
  width: clamp(160px, 20vw, 220px);

  .diver-illust {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const BrandPanel: React.FC = () => {
  return (
    <BrandPanelContainer aria-label="브랜드 소개">
      {/* 장식용 원형 요소 */}
      <DecoCircle $type="light" aria-hidden="true" />
      <DecoCircle $type="navy" aria-hidden="true" />
      <DecoCircle $type="cyan" aria-hidden="true" />

      {/* 로고 */}
      <LogoWrapper>
        <img src="/images/arena_01_01.png" alt="ARENA 로고" className="logo-img" />
      </LogoWrapper>


      {/* 바디 영역 */}
      <BodySection>
        {/* 원형 수영선수 이미지 */}
        <VisualCircle>
          <div className="visual-ring" aria-hidden="true" />
          <img src="/images/swimmer.png" alt="아레나 수영 선수" className="visual-img" />
        </VisualCircle>

        {/* 컨텐츠 영역 */}
        <ContentWrapper>
          <Title>
            물의 본능,아레나
            <span className="title-en">(Water Instinct, Arena)</span>
          </Title>

          <SubCopy>
            1973년 부터 이어온 혁신과 디자인으로
            <br />
            완벽한 퍼포먼스를 경험하세요
          </SubCopy>

          <IntroBadges>
            <span>차세대 안티포그 Swip 기술</span>
            <span>탁월한 시야</span>
            <span>최적의 수력학 디자인</span>
          </IntroBadges>

          <CtaButton to="/products" id="btn-brand-cta">
            자세히 보기
            <svg className="icon-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CtaButton>

          <EventWrapper>
            <p className="event-text">
              앱에서 첫구매시 <strong>5%할인쿠폰</strong> 제공
            </p>
            <StoreButtons>
              <StoreButton
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-google-store"
                aria-label="Google Store 바로가기"
              >
                <svg className="store-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1 1 0 01-.61-.92V2.734a1 1 0 01.609-.92z" />
                  <path d="M14.208 12l3.977-3.977 1.814 1.047A2 2 0 0120 12a2 2 0 01-1.001 1.73l-1.814 1.047L14.208 12z" opacity="0.7" />
                  <path d="M4.383 1.16l9.825 10.046-1.414 1.414-9.825-9.825c.38-.638.945-1.383 1.414-1.635z" opacity="0.55" />
                  <path d="M4.383 22.84l9.825-10.046-1.414-1.414-9.825 9.825c.38.638.945 1.383 1.414 1.635z" opacity="0.4" />
                </svg>
                <div className="store-text">
                  <span>Google Store</span>
                  <strong>바로가기</strong>
                </div>
              </StoreButton>
              <StoreButton
                href="https://apps.apple.com/kr/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-apple-store"
                aria-label="Apple Store 바로가기"
              >
                <svg className="store-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="store-text">
                  <span>Apple Store</span>
                  <strong>바로가기</strong>
                </div>
              </StoreButton>
            </StoreButtons>
          </EventWrapper>
        </ContentWrapper>
      </BodySection>

      {/* 다이버 일러스트 */}
      <IllustrationWrapper>
        <img src="/images/swim.png" alt="스쿠버 다이빙 일러스트" className="diver-illust" />
      </IllustrationWrapper>
    </BrandPanelContainer>
  );
};

export default BrandPanel;
