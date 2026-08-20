import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LoginModal, StoreGuideModal, CustomerCenterModal, AnnouncementsModal, BrandStoryModal, SettingsModal } from './Modals';

const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(16, 32, 43, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)} ;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  display: flex;
  justify-content: flex-start; /* 좌측 슬라이드 방식 설정 */
`;

const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  max-width: 390px;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 4px 0 24px rgba(0, 43, 73, 0.15); /* 좌측 슬라이드에 맞춰 그림자 방향을 우측으로 변경 */
  display: flex;
  flex-direction: column;
  position: relative;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')}; /* 좌측 바깥에서 들어오도록 변경 */
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
`;

const DrawerHeader = styled.header`
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eceff2;
  background: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;

  .logo-img {
    height: 24px;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  color: #10202b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const DrawerMain = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160px; /* 하단 고정 푸터 공간 확보 */
`;

const LoginBox = styled.a`
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: #00223d;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
  transition: background 0.2s ease;

  &:hover {
    background: #00182c;
  }

  .profile {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.white};
    margin-right: 14px;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  .text {
    flex: 1;
    h2 {
      font-size: clamp(0.95rem, 2vw + 0.2rem, 1.1rem);
      font-weight: 700;
      color: ${({ theme }) => theme.colors.white};
      margin-bottom: 3px;
    }
    p {
      font-size: clamp(0.72rem, 1.5vw + 0.1rem, 0.78rem);
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .arrow {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const CategorySection = styled.div`
  padding: 22px 16px 16px;

  .label {
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textFaint};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 12px;
  }
`;

const AccordionTrigger = styled.button<{ $isExpanded: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  text-align: left;

  span {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.15rem, 2.5vw + 0.3rem, 1.35rem);
    font-weight: 400;
    color: #10202b;
  }

  .icon-arrow {
    color: #10202b;
    transition: transform 0.2s ease;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  max-height: ${({ $isExpanded }) => ($isExpanded ? '200px' : '0px')};
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ul {
    list-style: none;
    padding: 8px 0 8px 14px;
    border-left: 2px solid #10202b;
    margin: 4px 0 8px 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li button {
      font-size: 14px;
      font-weight: 500;
      color: #10202b;
      text-align: left;
      width: 100%;
      padding: 2px 0;
      transition: color 0.15s ease;

      &:hover {
        color: ${({ theme }) => theme.colors.cyanDark};
      }
    }
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 16px 16px 24px;
  border-top: 1px solid #eceff2;
  display: flex;
  flex-direction: column;
  gap: 20px;

  li a,
  li button {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #10202b;
    font-weight: 600;
    font-size: 14px;
    transition: color 0.15s ease;
    width: 100%;
    text-align: left;

    &:hover {
      color: ${({ theme }) => theme.colors.cyanDark};
    }
  }

  .icon {
    width: 20px;
    height: 20px;
    color: #10202b;
    margin-right: 12px;
    flex-shrink: 0;
  }
`;

const DrawerFooter = styled.footer`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #00223d;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .brand-btn {
    background: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    color: #10202b;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #eceff2;
    }

    span {
      font-family: ${({ theme }) => theme.fonts.jua};
      font-size: 13px;
      font-weight: 400;
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .insta-btn {
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease, filter 0.2s ease;

    &:hover {
      transform: scale(1.08);
      filter: brightness(1.1);
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .settings-btn {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
    font-weight: 500;
    gap: 6px;
    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.white};
    }

    svg {
      color: rgba(255, 255, 255, 0.85);
    }

    &:hover svg {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

/* 관심 장비 모달 팝업 스타일 (현재 사용 안 함)
const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(16, 32, 43, 0.45);
  backdrop-filter: blur(5px);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 390px;
  background: #ffffff;
  border: 1.5px solid #10202b;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 43, 73, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1.5px solid #10202b;
  flex-shrink: 0;

  h4 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 15px;
    color: #10202b;
    font-weight: 400;
  }

  .close-modal-btn {
    color: #10202b;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  .wish-empty {
    text-align: center;
    padding: 32px 0;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 12px;
    font-weight: 500;
  }
`;

const WishItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  .media {
    width: 45px;
    height: 45px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
  }

  .body {
    flex: 1;
    text-align: left;

    h4 {
      font-size: 12px;
      font-weight: 700;
      color: #10202b;
      margin-bottom: 2px;
    }

    p {
      font-size: 10px;
      color: ${({ theme }) => theme.colors.textFaint};
    }
  }

  .btn-heart {
    color: #ff4b4b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.1);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const WISH_DATA: Record<string, { name: string; image: string; code: string }> = {
  cobra: { name: 'Cobra Ultra Swipe', image: '/images/goggles.png', code: '주문 #AR-86210 · 9월 20일' },
  mask: { name: 'The One Mask', image: '/images/mask_one.png', code: '주문 #AR-80392 · 10월 12일' },
  cruiser: { name: 'Cruiser Evo', image: '/images/cruiser_evo.png', code: '주문 #AR-79450 · 11월 05일' },
  airspeed: { name: 'Air Speed Mirror', image: '/images/air_speed.png', code: '주문 #AR-82240 · 12월 01일' },
};
*/

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useApp();
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 모달 상태 정의
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    onClose();
    navigate(`/products?filter=${filter}`);
  };

  const handleLinkClick = (to: string) => {
    onClose();
    navigate(to);
  };

  /* 현재 사용 안 함
  const handleWishItemClick = () => {
    onClose();
    setIsSettingsModalOpen(false);
    navigate('/myself');
  };
  */

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={onClose}>
        <DrawerContainer $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
          <DrawerHeader>
            <div className="logo-wrapper">
              <img src="/images/arena_02.png" alt="ARENA 로고" className="logo-img" />
            </div>
            <CloseButton onClick={onClose} aria-label="메뉴 닫기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
          </DrawerHeader>

          <DrawerMain>
            {/* 로그인 / 회원가입 */}
            <LoginBox onClick={() => setIsLoginModalOpen(true)} style={{ cursor: 'pointer' }}>
              <div className="profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text">
                <h2>{t('loginSignup')}</h2>
                <p>{t('memberBenefit')}</p>
              </div>
              <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </LoginBox>

            {/* 쇼핑 카테고리 */}
            <CategorySection>
              <span className="label">{t('shopping')}</span>
              <AccordionTrigger
                $isExpanded={isAccordionExpanded}
                onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
                aria-expanded={isAccordionExpanded}
              >
                <span>{t('goggles')}</span>
                <svg className="icon-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </AccordionTrigger>
              <AccordionContent $isExpanded={isAccordionExpanded}>
                <ul>
                  <li><button onClick={() => handleFilterClick('racing')}>{t('racing')}</button></li>
                  <li><button onClick={() => handleFilterClick('fitness')}>{t('fitness')}</button></li>
                  <li><button onClick={() => handleFilterClick('openwater')}>{t('openwater')}</button></li>
                </ul>
              </AccordionContent>
            </CategorySection>

            {/* 바로가기 링크 */}
            <LinkList>
              <li>
                <button onClick={() => handleLinkClick('/myself')}>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                  <span>{t('mypage')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsStoreModalOpen(true)}>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{t('stores')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsCustomerModalOpen(true)}>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{t('helpCenter')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsNoticeModalOpen(true)}>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>{t('notices')}</span>
                </button>
              </li>
            </LinkList>
          </DrawerMain>

          {/* 메뉴 푸터 */}
          <DrawerFooter>
            <button className="brand-btn" onClick={() => setIsBrandModalOpen(true)}>
              <span>{t('brandStory')}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <FooterBottom>
              <a href="https://www.instagram.com/arenakorea/" target="_blank" rel="noopener noreferrer" className="insta-btn" aria-label="아레나 인스타그램">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="8" fill="url(#insta-grad)" />
                  <path d="M12 7.5C9.514 7.5 7.5 9.514 7.5 12c0 2.485 2.014 4.5 4.5 4.5s4.5-2.015 4.5-4.5c0-2.486-2.014-4.5-4.5-4.5zm0 7.5c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm4.75-8.25a.875.875 0 11-1.75 0 .875.875 0 011.75 0z" fill="#fff" />
                  <path d="M17.5 4.5H6.5A2 2 0 004.5 6.5v11a2 2 0 002 2h11a2 2 0 002-2v-11a2 2 0 00-2-2zm.5 13c0 .827-.673 1.5-1.5 1.5H7.5A1.5 1.5 0 016 17.5v-11C6 5.673 6.673 5 7.5 5h9c.827 0 1.5.673 1.5 1.5v11z" fill="#fff" />
                  <defs>
                    <radialGradient id="insta-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.18 20.82) rotate(-45) scale(26.65)">
                      <stop stopColor="#FEE411" />
                      <stop offset="0.05" stopColor="#FED315" />
                      <stop offset="0.12" stopColor="#FDA522" />
                      <stop offset="0.2" stopColor="#FC5C35" />
                      <stop offset="0.27" stopColor="#FB174C" />
                      <stop offset="0.3" stopColor="#F5005A" />
                      <stop offset="0.48" stopColor="#B900B4" />
                      <stop offset="0.77" stopColor="#5B00F4" />
                      <stop offset="1" stopColor="#2E00FF" />
                    </radialGradient>
                  </defs>
                </svg>
              </a>
              <button className="settings-btn" onClick={() => setIsSettingsModalOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>{t('settings')}</span>
              </button>
            </FooterBottom>
          </DrawerFooter>
        </DrawerContainer>
      </DrawerOverlay>

      {/* 새 모달 컴포넌트 렌더링 */}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      {isStoreModalOpen && <StoreGuideModal onClose={() => setIsStoreModalOpen(false)} />}
      {isCustomerModalOpen && <CustomerCenterModal onClose={() => setIsCustomerModalOpen(false)} />}
      {isNoticeModalOpen && <AnnouncementsModal onClose={() => setIsNoticeModalOpen(false)} />}
      {isBrandModalOpen && <BrandStoryModal onClose={() => setIsBrandModalOpen(false)} />}
      {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
    </>
  );
};

export default MenuDrawer;
