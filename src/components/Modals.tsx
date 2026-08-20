import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { useApp } from '../context/AppContext';
import type { LanguageType } from '../utils/i18n';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Common Styled Components for Modals
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 32, 43, 0.45);
  backdrop-filter: blur(5px);
  z-index: 1010;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.25s ease-out;
  box-sizing: border-box;

  @media ${({ theme }) => theme.media.desktop} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    right: auto;
    bottom: auto;
  }
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border: 1.5px solid #10202b;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 43, 73, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
  animation: ${slideUp} 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1.5px solid #10202b;
  flex-shrink: 0;
  background: #ffffff;

  h3 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 18px;
    color: #10202b;
    font-weight: 400;
    margin: 0;
  }

  .close-btn {
    color: #10202b;
    background: none;
    border: none;
    cursor: pointer;
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
  padding: 20px;
  background: #fdfdfd;
  box-sizing: border-box;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

// ==========================================
// 1. LOGIN & SIGN UP MODAL
// ==========================================
interface LoginModalProps {
  onClose: () => void;
}

const InputGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;

  label {
    font-size: 12px;
    font-weight: 700;
    color: #002b49;
  }

  input, select {
    width: 100%;
    height: 44px;
    border: 1.5px solid #10202b;
    border-radius: 10px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 500;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: #00c2ff;
      box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.15);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid #10202b;
  background: #002b49;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 4px 0 #10202b;

  &:hover {
    background: #0b4a72;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #10202b;
  }
`;

const LinkActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  font-size: 12px;

  button {
    background: none;
    border: none;
    color: #64798a;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: #00c2ff;
    }
  }
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0 16px;
  color: #9aacb8;
  font-size: 11px;
  font-weight: 600;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e1eaf0;
  }

  span {
    padding: 0 10px;
  }
`;

const SocialButton = styled.button<{ $type: 'kakao' | 'google' }>`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid #10202b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  transition: transform 0.1s, opacity 0.15s;

  background: ${({ $type }) => ($type === 'kakao' ? '#fee500' : '#ffffff')};
  color: ${({ $type }) => ($type === 'kakao' ? '#181600' : '#10202b')};

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'find_pw'>('login');
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup Form States
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  // Find PW States
  const [findEmail, setFindEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    alert(`[로그인 완료]\n\n환영합니다! ${email} 계정으로 로그인되었습니다.`);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupPasswordConfirm || !nickname) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (signupPassword !== signupPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    alert(`[회원가입 완료]\n\n아레나 회원이 되신 것을 축하합니다!\n로그인 후 이용해 주세요.`);
    setMode('login');
  };

  const handleFindPwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    alert(`[임시 이메일 발송]\n\n${findEmail} 계정으로 비밀번호 재설정 안내 메일이 발송되었습니다.`);
    setMode('login');
  };

  const handleSocialLogin = (platform: string) => {
    alert(`[SNS 간편로그인]\n\n${platform} 계정 연동을 진행합니다.`);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            {mode === 'login' && '로그인'}
            {mode === 'signup' && '회원가입'}
            {mode === 'find_pw' && '비밀번호 찾기'}
          </h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <InputGroup>
                <label htmlFor="login-email">이메일 주소</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="example@arena.co.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="login-password">비밀번호</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">이메일 로그인</SubmitButton>

              <LinkActions>
                <button type="button" onClick={() => setMode('find_pw')}>비밀번호 찾기</button>
                <button type="button" onClick={() => setMode('signup')}>이메일 회원가입</button>
              </LinkActions>

              <SocialDivider>
                <span>또는 SNS 계정으로 로그인</span>
              </SocialDivider>

              <SocialButton type="button" $type="kakao" onClick={() => handleSocialLogin('카카오')}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 5.99l-.854 3.136c-.056.208.066.42.27.47.073.017.148.012.217-.015l3.666-2.43c.484.072.981.11 1.487.11 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z" />
                </svg>
                카카오 1초 로그인
              </SocialButton>

              <SocialButton type="button" $type="google" onClick={() => handleSocialLogin('구글')}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.137 4.2-3.507 0-6.35-2.843-6.35-6.35s2.843-6.35 6.35-6.35c1.614 0 3.08.6 4.225 1.583l3.076-3.076C18.665 1.957 15.65 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.748-4.257 10.748-11.24 0-.668-.073-1.32-.196-1.955H12.24z" />
                </svg>
                Google 계정으로 로그인
              </SocialButton>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <InputGroup>
                <label htmlFor="signup-email">이메일 주소 (아이디)</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="example@arena.co.kr"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="signup-nickname">이름/닉네임</label>
                <input
                  id="signup-nickname"
                  type="text"
                  placeholder="홍길동"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="signup-password">비밀번호</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="signup-password-confirm">비밀번호 확인</label>
                <input
                  id="signup-password-confirm"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">가입완료</SubmitButton>
              
              <LinkActions style={{ justifyContent: 'center' }}>
                <button type="button" onClick={() => setMode('login')}>이미 회원이신가요? 로그인</button>
              </LinkActions>
            </form>
          )}

          {mode === 'find_pw' && (
            <form onSubmit={handleFindPwSubmit}>
              <p style={{ fontSize: '12px', color: '#64798a', marginBottom: '20px', lineHeight: '1.5' }}>
                가입하신 이메일 주소를 입력하시면 비밀번호를 재설정할 수 있는 안전한 링크를 보내드립니다.
              </p>
              <InputGroup>
                <label htmlFor="find-email">가입한 이메일 주소</label>
                <input
                  id="find-email"
                  type="email"
                  placeholder="example@arena.co.kr"
                  value={findEmail}
                  onChange={(e) => setFindEmail(e.target.value)}
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">비밀번호 재설정 이메일 전송</SubmitButton>
              
              <LinkActions style={{ justifyContent: 'center' }}>
                <button type="button" onClick={() => setMode('login')}>로그인 화면으로 돌아가기</button>
              </LinkActions>
            </form>
          )}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};


// ==========================================
// 2. STORE GUIDE MODAL
// ==========================================
interface StoreGuideModalProps {
  onClose: () => void;
}

const TabRow = styled.div`
  display: flex;
  gap: 4px;
  background: #eceff2;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1.5px solid #10202b;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 32px;
  border-radius: 7px;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  background: ${({ $active }) => ($active ? '#002b49' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#64798a')};

  &:hover {
    background: ${({ $active }) => ($active ? '#002b49' : 'rgba(0, 43, 73, 0.05)')};
  }
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 16px;

  input {
    width: 100%;
    height: 38px;
    border: 1.5px solid #10202b;
    border-radius: 10px;
    padding: 0 38px 0 12px;
    font-size: 12px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #00c2ff;
    }
  }

  .icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #10202b;
  }
`;

const StoreItem = styled.div`
  border: 1.5px solid #10202b;
  border-radius: 12px;
  background: #ffffff;
  padding: 14px;
  margin-bottom: 12px;
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 43, 73, 0.06);
  }

  .tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    background: #eaf3f8;
    color: #0b4a72;
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 6px;
    border: 1px solid #10202b;
  }

  h4 {
    font-size: 13px;
    font-weight: 800;
    color: #10202b;
    margin: 0 0 6px;
  }

  p {
    font-size: 11px;
    color: #64798a;
    margin: 0 0 4px;
    line-height: 1.4;
  }

  .tel {
    font-weight: 700;
    color: #009fdb;
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    font-size: 11px;
    margin-top: 8px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

interface StoreData {
  id: number;
  region: 'seoul' | 'busan' | 'etc';
  regionLabel: string;
  name: string;
  address: string;
  hours: string;
  tel: string;
}

const STORES: StoreData[] = [
  { id: 1, region: 'seoul', regionLabel: '서울/경기', name: '아레나 청담 직영 매장', address: '서울특별시 강남구 삼성로 712 아레나빌딩 1층', hours: '오전 10:30 ~ 오후 8:00', tel: '02-540-1973' },
  { id: 2, region: 'seoul', regionLabel: '서울/경기', name: '아레나 현대백화점 무역센터점', address: '서울특별시 강남구 테헤란로 517 현대백화점 6층', hours: '오전 10:30 ~ 오후 8:30', tel: '02-3467-8622' },
  { id: 3, region: 'seoul', regionLabel: '서울/경기', name: '아레나 롯데백화점 잠실점', address: '서울특별시 송파구 올림픽로 240 롯데백화점 잠실점 7층', hours: '오전 10:30 ~ 오후 8:00 (금토일 8:30 연장)', tel: '02-411-6450' },
  { id: 4, region: 'busan', regionLabel: '부산/경남', name: '아레나 신세계 센텀시티점', address: '부산광역시 해운대구 센텀남대로 35 신세계센텀시티 3층', hours: '오전 10:30 ~ 오후 8:00', tel: '051-745-1282' },
  { id: 5, region: 'busan', regionLabel: '부산/경남', name: '아레나 롯데백화점 부산본점', address: '부산광역시 부산진구 가야대로 772 롯데백화점 5층', hours: '오전 10:30 ~ 오후 8:30', tel: '051-810-3571' },
  { id: 6, region: 'etc', regionLabel: '대구/경북', name: '아레나 신세계백화점 대구점', address: '대구광역시 동구 동부로 149 신세계백화점 대구점 6층', hours: '오전 10:30 ~ 오후 8:00', tel: '053-661-6893' },
  { id: 7, region: 'etc', regionLabel: '광주/호남', name: '아레나 롯데백화점 광주점', address: '광주광역시 북구 독립로 268 롯데백화점 6층', hours: '오전 10:30 ~ 오후 8:00', tel: '062-690-3444' }
];

export const StoreGuideModal: React.FC<StoreGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'seoul' | 'busan' | 'etc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      const matchesTab = activeTab === 'all' || store.region === activeTab;
      const matchesSearch = store.name.includes(searchQuery) || store.address.includes(searchQuery);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>매장안내</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          <TabRow>
            <TabButton $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>전체</TabButton>
            <TabButton $active={activeTab === 'seoul'} onClick={() => setActiveTab('seoul')}>서울/경기</TabButton>
            <TabButton $active={activeTab === 'busan'} onClick={() => setActiveTab('busan')}>부산/경남</TabButton>
            <TabButton $active={activeTab === 'etc'} onClick={() => setActiveTab('etc')}>기타</TabButton>
          </TabRow>

          <SearchBox>
            <input
              type="text"
              placeholder="매장명 또는 주소 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </SearchBox>

          {filteredStores.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9aacb8', fontSize: '12px', padding: '32px 0' }}>
              검색 조건에 맞는 매장이 없습니다.
            </p>
          ) : (
            filteredStores.map((store) => (
              <StoreItem key={store.id}>
                <span className="tag">{store.regionLabel}</span>
                <h4>{store.name}</h4>
                <p>📍 {store.address}</p>
                <p>🕒 {store.hours}</p>
                <a href={`tel:${store.tel}`} className="tel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {store.tel} (매장 전화연결)
                </a>
              </StoreItem>
            ))
          )}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};


// ==========================================
// 3. CUSTOMER CENTER MODAL
// ==========================================
interface CustomerCenterModalProps {
  onClose: () => void;
}

const CenterBanner = styled.div`
  background: #002b49;
  border-radius: 12px;
  border: 1.5px solid #10202b;
  padding: 16px;
  color: #ffffff;
  text-align: left;
  margin-bottom: 20px;

  h4 {
    margin: 0 0 4px;
    font-size: 13px;
    color: #00c2ff;
  }

  .tel {
    font-size: 20px;
    font-weight: 900;
    margin: 0 0 8px;
  }

  p {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.4;
  }
`;

const AccordionItem = styled.div<{ $isExpanded: boolean }>`
  border: 1.5px solid #10202b;
  border-radius: 12px;
  background: #ffffff;
  margin-bottom: 8px;
  overflow: hidden;
`;

const AccordionHeader = styled.button<{ $isExpanded: boolean }>`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ $isExpanded }) => ($isExpanded ? '#f5fafc' : '#ffffff')};
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #10202b;
  transition: background-color 0.2s;

  .arrow {
    transition: transform 0.2s;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const AccordionBodyText = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => ($isExpanded ? '200px' : '0px')};
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  border-top: ${({ $isExpanded }) => ($isExpanded ? '1px solid #e1eaf0' : 'none')};

  .content-inner {
    padding: 12px 14px;
    font-size: 11px;
    color: #64798a;
    line-height: 1.5;
    text-align: left;
  }
`;

const SubmitInquiryBox = styled.div`
  border-top: 1.5px solid #10202b;
  margin-top: 24px;
  padding-top: 20px;
  text-align: left;

  h4 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 14px;
    font-weight: 400;
    color: #10202b;
    margin: 0 0 12px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 90px;
  border: 1.5px solid #10202b;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  font-family: inherit;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #00c2ff;
  }
`;

interface FaqData {
  id: number;
  q: string;
  a: string;
}

const FAQS: FaqData[] = [
  { id: 1, q: '배송은 얼마나 걸리나요?', a: '영업일 기준 오후 2시 이전 결제 완료 건은 당일 출고되며, 전국 대부분 지역에서 출고 후 1~2일 이내에 상품을 받아보실 수 있습니다. 도서산간 지역은 1~2일이 추가로 소요될 수 있습니다.' },
  { id: 2, q: '반품 및 교환 절차는 어떻게 되나요?', a: '마이페이지의 최근 주문 내역에서 간편하게 신청하실 수 있습니다. 단순 변심에 의한 반품/교환은 왕복 배송비(6,000원)가 청구되며, 제품 불량 또는 오배송의 경우 배송비는 무료입니다.' },
  { id: 3, q: '선수용 경기 수경(미러 렌즈) 관리법은?', a: '미러 렌즈 안쪽에는 안티포그(김서림 방지) 코팅이 되어 있어 손가락이나 수건으로 문지르면 코팅이 손상됩니다. 수영 후 차가운 수돗물에 가볍게 헹구어 직사광선을 피해 그늘에서 자연 건조해 주세요.' }
];

export const CustomerCenterModal: React.FC<CustomerCenterModalProps> = ({ onClose }) => {
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  
  // inquiry form states
  const [inquiryType, setInquiryType] = useState('배송문의');
  const [inquiryContent, setInquiryContent] = useState('');

  const toggleFaq = (id: number) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryContent.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }
    alert(`[1:1 문의 접수 완료]\n\n분류: ${inquiryType}\n\n문의글이 아레나 고객센터로 성공적으로 전달되었습니다.\n답변은 마이페이지 또는 가입한 이메일에서 확인하실 수 있습니다.`);
    setInquiryContent('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>고객센터</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          <CenterBanner>
            <h4>아레나 고객만족센터</h4>
            <div className="tel">1588-1973</div>
            <p>월~금 09:30 ~ 17:30 (점심시간 12:00 ~ 13:00)</p>
            <p>토, 일, 공휴일 휴무</p>
          </CenterBanner>

          <h4 style={{ fontSize: '13px', fontWeight: 800, textAlign: 'left', margin: '0 0 10px', color: '#10202b' }}>자주 묻는 질문 (FAQ)</h4>

          {FAQS.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <AccordionItem key={faq.id} $isExpanded={isExpanded}>
                <AccordionHeader $isExpanded={isExpanded} onClick={() => toggleFaq(faq.id)}>
                  <span>Q. {faq.q}</span>
                  <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </AccordionHeader>
                <AccordionBodyText $isExpanded={isExpanded}>
                  <div className="content-inner">
                    {faq.a}
                  </div>
                </AccordionBodyText>
              </AccordionItem>
            );
          })}

          <SubmitInquiryBox>
            <h4>1:1 비대면 문의 접수</h4>
            <form onSubmit={handleInquirySubmit}>
              <InputGroup>
                <label htmlFor="inquiry-type">문의 분류</label>
                <select id="inquiry-type" value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
                  <option value="배송문의">배송문의</option>
                  <option value="반품/교환">반품/교환</option>
                  <option value="상품문의">상품문의 (사이즈/재고 등)</option>
                  <option value="기타문의">기타문의</option>
                </select>
              </InputGroup>

              <InputGroup style={{ marginBottom: '8px' }}>
                <label htmlFor="inquiry-textarea">문의 내용</label>
                <TextArea
                  id="inquiry-textarea"
                  placeholder="답변은 회원님의 가입된 메일로 발송되며, 접수된 내용은 순차적으로 성실히 답변 드리겠습니다."
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                />
              </InputGroup>

              <SubmitButton type="submit" style={{ height: '40px', marginTop: '0', fontSize: '13px' }}>1:1 문의 접수하기</SubmitButton>
            </form>
          </SubmitInquiryBox>
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};


// ==========================================
// 4. ANNOUNCEMENTS MODAL
// ==========================================
interface AnnouncementsModalProps {
  onClose: () => void;
}

const NoticeRow = styled.div<{ $isExpanded: boolean }>`
  border-bottom: 1px solid #e1eaf0;
  background: ${({ $isExpanded }) => ($isExpanded ? '#f5fafc' : 'transparent')};
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }
`;

const NoticeHeader = styled.button`
  width: 100%;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  .meta {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 6px;
    font-size: 10px;
    font-weight: 700;

    .tag {
      color: #009fdb;
    }
    .date {
      color: #9aacb8;
    }
  }

  h4 {
    font-size: 12px;
    font-weight: 700;
    color: #10202b;
    margin: 0;
    line-height: 1.45;
  }
`;

const NoticeContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => ($isExpanded ? '300px' : '0px')};
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;

  .inner {
    padding: 14px 12px 20px;
    font-size: 11px;
    color: #64798a;
    line-height: 1.6;
    border-top: 1px dashed #eceff2;
    text-align: left;
    white-space: pre-line;
  }
`;

interface NoticeData {
  id: number;
  tag: string;
  date: string;
  title: string;
  content: string;
}

const NOTICES: NoticeData[] = [
  {
    id: 1,
    tag: '멤버십',
    date: '2026.08.15',
    title: '아레나 공식 몰 멤버십 등급 혜택 일부 개편 안내',
    content: '안녕하세요. 아레나 공식 몰 운영팀입니다.\n\n2026년 9월 1일자로 공식 몰 회원님들을 대상으로 제공되는 등급별 적립금 혜택이 다음과 같이 개편될 예정입니다.\n\n- 로열(Royal) 등급: 상시 3% -> 5% 적립 상향\n- VIP 등급: 연 1회 무료 수선 무료배송 -> 월 1회 확대\n- 실버/브론즈 등급: 생일 특별 할인쿠폰 상향 조정\n\n앞으로도 회원 여러분께 더욱 풍성한 혜택을 제공할 수 있도록 끊임없이 개선하겠습니다. 자세한 사항은 마이페이지 멤버십 정책 상세보기를 참조하세요.'
  },
  {
    id: 2,
    tag: '배송',
    date: '2026.08.10',
    title: '추석 명절 연휴 기간 배송 일정 및 고객센터 휴무 공지',
    content: '안녕하세요. 아레나 공식 몰입니다. 한가위를 맞이하여 택배 배송 및 고객센터 휴무 일정을 안내해 드립니다.\n\n- 배송 마감: 9월 14일(월) 오후 1시 결제완료 건까지 연휴 전 출고\n- 배송 중단: 9월 15일(화) ~ 9월 18일(금) 연휴 기간\n- 배송 재개: 9월 21일(월)부터 순차 배송\n- 고객센터 휴무: 9월 15일 ~ 9월 18일\n\n연휴 전후로는 택배사 물량 폭증으로 인해 평소보다 배송이 1~3일 지연될 수 있으니 수영 장비가 급히 필요하신 회원님께서는 미리 주문을 완료해 주시기 바랍니다.'
  },
  {
    id: 3,
    tag: '공지',
    date: '2026.08.01',
    title: '시스템 고도화 안정성을 위한 주간 서버 정기 점검 안내',
    content: '안녕하세요. 아레나 공식 개발팀입니다.\n\n결제 모듈 고도화 및 데이터베이스 서버 장비 교체를 위해 다가오는 8월 5일(수) 새벽에 정기 시스템 점검이 있을 예정입니다.\n\n- 점검 일시: 8월 5일 오전 02:00 ~ 오전 06:00 (약 4시간)\n- 영향 범위: 작업 시간 동안 사이트 접속 불가 및 결제 중단\n\n점검 시간 동안에는 안정적인 서비스 제공을 위해 부득이하게 서비스를 제한하오니 고객 여러분의 너른 양해 부탁드립니다.'
  },
  {
    id: 4,
    tag: '이벤트',
    date: '2026.07.25',
    title: '파워스킨(Powerskin) 카본 수영복 포토리뷰 이벤트',
    content: '★ ARENA POWERSKIN CARBON PHOTO REVIEW EVENT ★\n\n세계적인 엘리트 선수들이 검증한 아레나 대표 경기용 수영복 파워스킨 시리즈를 구매하시고 생생한 실착 포토 리뷰를 남겨주세요!\n\n- 이벤트 기간: 7월 25일 ~ 8월 31일\n- 참여 대상: 기간 내 파워스킨 구매 고객 전원\n- 참여 혜택:\n  1. 우수 포토리뷰어 10명 선정: 경기용 고급 고글(Cobra Ultra) 증정\n  2. 참여자 전원: 즉시 사용 가능한 공식몰 적립금 5,000원 적립\n\n물속에서의 짜릿한 성능을 솔직하게 공유해 주세요!'
  }
];

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ onClose }) => {
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);

  const toggleNotice = (id: number) => {
    setExpandedNoticeId(expandedNoticeId === id ? null : id);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>공지사항</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody style={{ padding: '10px 14px' }}>
          {NOTICES.map((notice) => {
            const isExpanded = expandedNoticeId === notice.id;
            return (
              <NoticeRow key={notice.id} $isExpanded={isExpanded}>
                <NoticeHeader onClick={() => toggleNotice(notice.id)}>
                  <div className="meta">
                    <span className="tag">[{notice.tag}]</span>
                    <span className="date">{notice.date}</span>
                  </div>
                  <h4>{notice.title}</h4>
                </NoticeHeader>
                <NoticeContent $isExpanded={isExpanded}>
                  <div className="inner">
                    {notice.content}
                  </div>
                </NoticeContent>
              </NoticeRow>
            );
          })}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};


// ==========================================
// 5. BRAND STORY MODAL
// ==========================================
interface BrandStoryModalProps {
  onClose: () => void;
}

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const StoryHero = styled.div`
  background: linear-gradient(135deg, #002b49 0%, #009fdb 50%, #00c2ff 100%);
  padding: 30px 20px;
  border-radius: 14px;
  border: 1.5px solid #10202b;
  color: #ffffff;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  h4 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 26px;
    font-weight: 400;
    margin: 0 0 8px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 43, 73, 0.3);
  }

  p {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
  }

  .wave-bg {
    position: absolute;
    bottom: -10px;
    right: -20px;
    opacity: 0.2;
    transform: rotate(-15deg);
    pointer-events: none;
  }
`;

const StorySection = styled.div`
  margin-bottom: 22px;

  h5 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 16px;
    font-weight: 400;
    color: #10202b;
    margin: 0 0 8px;
    border-left: 3px solid #009fdb;
    padding-left: 8px;
  }

  p {
    font-size: 11.5px;
    color: #64798a;
    line-height: 1.6;
    margin: 0;
  }
`;

const StoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 14px;
  border: 1.5px solid #10202b;
  margin: 10px 0 20px;

  .stat-card {
    text-align: center;

    .num {
      font-family: ${({ theme }) => theme.fonts.jua};
      font-size: 18px;
      color: #0b4a72;
      margin-bottom: 2px;
    }

    .lbl {
      font-size: 9px;
      font-weight: 800;
      color: #9aacb8;
      text-transform: uppercase;
    }
  }
`;

export const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>브랜드 스토리</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          <StoryContainer>
            <StoryHero>
              <h4>WATER<br />INSTINCT</h4>
              <p>1973년부터 이어온 물의 본능, 아레나</p>
              <svg className="wave-bg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </StoryHero>

            <StorySection>
              <h5>브랜드의 탄생</h5>
              <p>
                아레나(ARENA)는 1972년 뮌헨 올림픽에서 전설적인 수영 선수 마크 스피츠(Mark Spitz)가 7개의 금메달을 목에 걸며 세계 최고 기록을 갱신하는 순간 탄생했습니다. 아디다스의 창립자 아들이었던 호르스트 다슬러(Horst Dassler)는 이 경이로운 장면을 목격한 후, 세계 최고의 스포츠 수영 전문 브랜드를 런칭하기로 결심하였습니다.
              </p>
            </StorySection>

            <StoryStats>
              <div className="stat-card">
                <div className="num">1973</div>
                <div className="lbl">설립 년도</div>
              </div>
              <div className="stat-card">
                <div className="num">50+</div>
                <div className="lbl">수출 국가</div>
              </div>
              <div className="stat-card">
                <div className="num">99%</div>
                <div className="lbl">선수 신뢰도</div>
              </div>
            </StoryStats>

            <StorySection>
              <h5>혁신과 진화</h5>
              <p>
                1973년 초경량 수영복인 Skinfit® 개발을 시작으로, 아레나는 물 저항을 최소화하는 하이테크 카본 기술력의 Powerskin® 라인까지 엘리트 선수들의 경기력 극대화를 위한 연구를 멈추지 않았습니다.
              </p>
            </StorySection>

            <StorySection>
              <h5>물의 본능(Water Instinct)</h5>
              <p>
                아레나에게 물은 극복할 대상이 아니라 본능적으로 교감하고 즐기는 아름다운 놀이터입니다. 엘리트 선수의 트랙터 리부터 취미로 즐기는 일상 속 풀장까지, 물속에 있는 모든 순간의 편안함과 즐거움을 제공하는 것이 우리의 핵심 가치입니다.
              </p>
            </StorySection>
          </StoryContainer>
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};

// ==========================================
// 6. SETTINGS MODAL (환경설정)
// ==========================================
interface SettingsModalProps {
  onClose: () => void;
}

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .3s;
    border-radius: 24px;
    border: 1px solid #10202b;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
    border: 1px solid #10202b;
  }

  input:checked + .slider {
    background-color: #00c2ff;
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

const SettingSection = styled.div`
  margin-bottom: 24px;

  .sec-title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 14px;
    color: #002b49;
    margin: 0 0 8px;
    border-bottom: 1.5px solid #10202b;
    padding-bottom: 4px;
    text-align: left;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  .lbl-group {
    text-align: left;
    h4 {
      font-size: 13px;
      font-weight: 700;
      color: #10202b;
      margin: 0 0 2px;
    }
    p {
      font-size: 10px;
      color: #64798a;
      margin: 0;
    }
  }

  select {
    height: 32px;
    border: 1.5px solid #10202b;
    border-radius: 6px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 700;
    color: #10202b;
    background: #ffffff;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #00c2ff;
    }
  }

  .action-btn {
    height: 32px;
    border: 1.5px solid #10202b;
    border-radius: 6px;
    background: #ffffff;
    color: #10202b;
    padding: 0 12px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background: #eceff2;
    }
  }
`;

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { language, setLanguage, t } = useApp();
  const [pushNotif, setPushNotif] = useState(true);
  const [nightSilent, setNightSilent] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(true);
  const [currency, setCurrency] = useState('krw');

  const handleClearCache = () => {
    alert(language === 'en' ? '[Cache Cleared]\n\nTemporary images and 2.4MB of cache data have been cleared.' : '[캐시 정리 완료]\n\n임시 이미지 및 텍스트 데이터 2.4MB 캐시가 정리되었습니다.');
  };

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{t('settings')}</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          {/* 알림 설정 */}
          <SettingSection>
            <div className="sec-title">{t('notifSettings')}</div>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('pushNotif')}</h4>
                <p>{t('pushNotifDesc')}</p>
              </div>
              <ToggleSwitch>
                <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
                <span className="slider"></span>
              </ToggleSwitch>
            </SettingRow>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('nightSilent')}</h4>
                <p>{t('nightSilentDesc')}</p>
              </div>
              <ToggleSwitch>
                <input type="checkbox" checked={nightSilent} onChange={(e) => setNightSilent(e.target.checked)} />
                <span className="slider"></span>
              </ToggleSwitch>
            </SettingRow>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('marketingNotif')}</h4>
                <p>{t('marketingNotifDesc')}</p>
              </div>
              <ToggleSwitch>
                <input type="checkbox" checked={marketingNotif} onChange={(e) => setMarketingNotif(e.target.checked)} />
                <span className="slider"></span>
              </ToggleSwitch>
            </SettingRow>
          </SettingSection>

          {/* 언어 및 통화 */}
          <SettingSection>
            <div className="sec-title">{t('countryCurrency')}</div>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('displayLang')}</h4>
                <p>{language === 'en' ? 'Default display language for the app' : '앱 내 표시될 기본 언어'}</p>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageType)}>
                <option value="ko">한국어 (Korean)</option>
                <option value="en">English (영어)</option>
              </select>
            </SettingRow>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('payCurrency')}</h4>
                <p>{language === 'en' ? 'Product price display currency' : '상품 가격 표시 통화'}</p>
              </div>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="krw">KRW (₩)</option>
                <option value="usd">USD ($)</option>
              </select>
            </SettingRow>
          </SettingSection>

          {/* 시스템 관리 */}
          <SettingSection>
            <div className="sec-title">{t('storageSecurity')}</div>
            <SettingRow>
              <div className="lbl-group">
                <h4>{t('clearCache')}</h4>
                <p>{t('clearCacheDesc')}</p>
              </div>
              <button className="action-btn" onClick={handleClearCache}>{t('cleanBtn')}</button>
            </SettingRow>
          </SettingSection>

          {/* 앱 버전 정보 */}
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '11px', color: '#9aacb8' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{t('versionInfo')}</p>
            <p style={{ margin: '0' }}>{t('copyright')}</p>
          </div>
        </ModalBody>
      </ModalCard>
    </ModalOverlay>,
    document.querySelector('.service-panel') || document.body
  );
};

// ==========================================
// 7. RETURN & EXCHANGE REQUEST MODAL
// ==========================================
interface ReturnRequestModalProps {
  onClose: () => void;
}

const ReturnOptionGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ReturnTypeChip = styled.button<{ $isActive: boolean }>`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid ${({ $isActive, theme }) => ($isActive ? '#10202b' : theme.colors.border)};
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.navy : '#ffffff')};
  color: ${({ $isActive, theme }) => ($isActive ? '#ffffff' : theme.colors.textMuted)};
  font-weight: 700;
  font-size: 13px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #10202b;
  }
`;

const ProductInfoCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
  align-items: center;

  .media {
    width: 60px;
    height: 60px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
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
      font-size: 13px;
      font-weight: 700;
      color: #10202b;
      margin-bottom: 2px;
    }

    p {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 90px;
  border: 1.5px solid #10202b;
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  box-sizing: border-box;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #00c2ff;
    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.15);
  }
`;

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ onClose }) => {
  const [requestType, setRequestType] = useState<'exchange' | 'return'>('exchange');
  const [reason, setReason] = useState('변심');
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('010-1234-5678');
  const [address, setAddress] = useState('서울특별시 강남구 아레나타워 5층');

  const handleSubmit = () => {
    const typeText = requestType === 'exchange' ? '교환' : '반품';
    alert(
      `[${typeText} 신청 완료]\n\nPowerskin Carbon Core FX Jammer 상품에 대한 ${typeText} 신청이 성공적으로 접수되었습니다.\n\n수거지 주소: ${address}\n연락처: ${phone}\n신청 사유: ${reason}\n\n영업일 기준 1~3일 이내에 수거 기사님이 방문할 예정입니다.`
    );
    onClose();
  };

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>교환 / 반품 신청</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>

        <ModalBody>
          {/* 상품 정보 */}
          <ProductInfoCard>
            <div className="media">
              <img src="/images/swimmer.png" alt="Powerskin Carbon Jammer" />
            </div>
            <div className="body">
              <h4>Powerskin Carbon Core FX Jammer</h4>
              <p>남성 탄소 섬유 경기용 잼머 · M</p>
            </div>
          </ProductInfoCard>

          {/* 신청 유형 선택 */}
          <InputGroup>
            <label>신청 유형</label>
            <ReturnOptionGroup>
              <ReturnTypeChip
                $isActive={requestType === 'exchange'}
                onClick={() => setRequestType('exchange')}
              >
                교환 신청
              </ReturnTypeChip>
              <ReturnTypeChip
                $isActive={requestType === 'return'}
                onClick={() => setRequestType('return')}
              >
                반품 신청
              </ReturnTypeChip>
            </ReturnOptionGroup>
          </InputGroup>

          {/* 사유 선택 */}
          <InputGroup>
            <label>신청 사유</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="변심">단순 변심</option>
              <option value="사이즈">사이즈가 맞지 않음</option>
              <option value="불량">제품 불량 및 파손</option>
              <option value="오배송">주문한 것과 다른 상품 배송</option>
            </select>
          </InputGroup>

          {/* 상세 사유 */}
          <InputGroup>
            <label>상세 내용 (선택사항)</label>
            <Textarea
              placeholder="상세한 사유를 기입해 주시면 더욱 신속한 처리가 가능합니다."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </InputGroup>

          {/* 수거지 및 연락처 정보 */}
          <InputGroup>
            <label>연락처</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <label>수거지 주소</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </InputGroup>

          {/* 제출 버튼 */}
          <SubmitButton onClick={handleSubmit} style={{ marginTop: '16px' }}>
            {requestType === 'exchange' ? '교환 신청 완료' : '반품 신청 완료'}
          </SubmitButton>
        </ModalBody>
      </ModalCard>
    </ModalOverlay>,
    document.querySelector('.service-panel') || document.body
  );
};

// ==========================================
// 8. PAYMENT & CHECKOUT MODAL
// ==========================================
interface PaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
  totalPrice: number;
  itemCount: number;
}

const PaymentMethodGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const PaymentMethodOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid ${({ $isSelected, theme }) => ($isSelected ? '#10202b' : theme.colors.border)};
  background: ${({ $isSelected }) => ($isSelected ? '#f5fafd' : '#ffffff')};
  color: #10202b;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  transition: all 0.15s ease;

  .check-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.cyan : '#cbd5e1')};
    background: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.cyan : 'transparent')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 11px;
    font-weight: 900;
  }
`;

// Toss Pay specific styles
const TossPayButton = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 12px;
  border: none;
  background: #0064FF;
  color: #ffffff;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0, 100, 255, 0.35);
  letter-spacing: -0.3px;

  &:hover {
    background: #0050CC;
    box-shadow: 0 6px 20px rgba(0, 100, 255, 0.45);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(0, 100, 255, 0.25);
  }

  .toss-logo-text {
    font-size: 20px;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -1px;
  }
`;

const TossPayBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #0064FF;
  color: #fff;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.5px;
  line-height: 1.4;
`;

const TossPayInfoBox = styled.div`
  background: #f0f6ff;
  border: 1.5px solid #c2d9ff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 12px;
  margin-bottom: 4px;
  text-align: left;

  .toss-info-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 800;
    color: #0050CC;
  }

  .toss-info-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .toss-info-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #4a6fa5;
      font-weight: 600;

      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #0064FF;
        flex-shrink: 0;
      }
    }
  }
`;

const TossProcessingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  animation: ${fadeIn} 0.2s ease-out;

  .toss-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e0ecff;
    border-top-color: #0064FF;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .toss-processing-title {
    font-size: 16px;
    font-weight: 800;
    color: #0064FF;
  }

  .toss-processing-sub {
    font-size: 12px;
    color: #64798a;
    font-weight: 600;
  }
`;

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentSuccess, totalPrice, itemCount }) => {
  const [method, setMethod] = useState<'card' | 'easy' | 'bank' | 'toss'>('card');
  const [deliveryMsg, setDeliveryMsg] = useState('문 앞에 놓아주세요');
  const [isTossProcessing, setIsTossProcessing] = useState(false);

  const handleGeneralPayment = async (selectedMethod: 'card' | 'easy' | 'toss' | 'bank') => {
    if (selectedMethod === 'bank') {
      onPaymentSuccess();
      return;
    }

    try {
      setIsTossProcessing(true);
      const TossPayments = (window as any).TossPayments;
      if (!TossPayments) {
        alert("토스 페이먼츠 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        setIsTossProcessing(false);
        return;
      }

      const tossPayments = TossPayments("test_ck_DpexMgkW36RM7BDG6qqb3GbR5ozO");
      const clientRandomKey = `AR-GUEST-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const payment = tossPayments.payment({
        customerKey: clientRandomKey,
      });

      const generatedOrderId = `AR-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const orderName = itemCount > 1 ? `아레나 상품 외 ${itemCount - 1}건` : "아레나 상품 1건";
      const successUrl = `${window.location.origin}/payment/success`;
      const failUrl = `${window.location.origin}/payment/fail`;

      if (selectedMethod === 'card') {
        await payment.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: totalPrice },
          orderId: generatedOrderId,
          orderName,
          successUrl,
          failUrl,
        });
      } else if (selectedMethod === 'easy') {
        await payment.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: totalPrice },
          orderId: generatedOrderId,
          orderName,
          successUrl,
          failUrl,
        });
      } else if (selectedMethod === 'toss') {
        await payment.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: totalPrice },
          orderId: generatedOrderId,
          orderName,
          successUrl,
          failUrl,
          card: {
            flowMode: "DIRECT",
            easyPay: "TOSSPAY",
          },
        });
      }
    } catch (error: any) {
      console.error("Toss Payments Error:", error);
      setIsTossProcessing(false);
      alert(`결제 요청 중 오류가 발생했습니다: ${error.message || error}`);
    }
  };

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        {/* 토스 결제 처리 중 오버레이 */}
        {isTossProcessing && (
          <TossProcessingOverlay>
            <div className="toss-spinner" />
            <div className="toss-processing-title">토스 결제 처리 중...</div>
            <div className="toss-processing-sub">잠시만 기다려 주세요</div>
          </TossProcessingOverlay>
        )}

        <ModalHeader>
          <h3>주문 및 결제</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기" disabled={isTossProcessing}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>

        <ModalBody style={{ padding: '20px' }}>
          {/* 결제 요약 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #10202b', marginBottom: '20px', textAlign: 'left' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#64798a', fontWeight: 700 }}>결제 대상 상품</h4>
            <p style={{ margin: '0 0 12px', fontSize: '15px', color: '#10202b', fontWeight: 800 }}>아레나 수경 외 총 {itemCount}개 상품</p>
            <div style={{ borderTop: '1px dashed #10202b', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#10202b', fontWeight: 700 }}>최종 결제 금액</span>
              <span style={{ fontSize: '18px', color: '#002b49', fontWeight: 900 }}>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 결제 수단 선택 */}
          <InputGroup>
            <label>결제 수단</label>
            <PaymentMethodGroup>
              <PaymentMethodOption $isSelected={method === 'card'} onClick={() => setMethod('card')}>
                <div className="check-circle">{method === 'card' && '✓'}</div>
                신용/체크카드 결제
              </PaymentMethodOption>
              <PaymentMethodOption $isSelected={method === 'easy'} onClick={() => setMethod('easy')}>
                <div className="check-circle">{method === 'easy' && '✓'}</div>
                카카오페이 / 네이버페이 간편결제
              </PaymentMethodOption>
              <PaymentMethodOption $isSelected={method === 'toss'} onClick={() => setMethod('toss')} style={{ border: method === 'toss' ? '2px solid #0064FF' : undefined, background: method === 'toss' ? '#f0f6ff' : undefined }}>
                <div className="check-circle" style={{ borderColor: method === 'toss' ? '#0064FF' : undefined, background: method === 'toss' ? '#0064FF' : undefined }}>
                  {method === 'toss' && '✓'}
                </div>
                <TossPayBadge>toss</TossPayBadge>
                <span style={{ fontWeight: 800 }}>토스 간편결제</span>
              </PaymentMethodOption>
              <PaymentMethodOption $isSelected={method === 'bank'} onClick={() => setMethod('bank')}>
                <div className="check-circle">{method === 'bank' && '✓'}</div>
                무통장 입금
              </PaymentMethodOption>
            </PaymentMethodGroup>
          </InputGroup>

          {/* 배송 메시지 */}
          <InputGroup style={{ marginBottom: '20px' }}>
            <label>배송 요청사항</label>
            <select value={deliveryMsg} onChange={(e) => setDeliveryMsg(e.target.value)}>
              <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
              <option value="배송 전 연락바랍니다">배송 전 연락바랍니다</option>
              <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
              <option value="직접 수령하겠습니다">직접 수령하겠습니다</option>
            </select>
          </InputGroup>

          {/* 토스 결제 선택 시 전용 UI */}
          {method === 'toss' && (
            <>
              <TossPayInfoBox>
                <div className="toss-info-title">
                  <TossPayBadge>toss</TossPayBadge>
                  토스 간편결제 안내
                </div>
                <div className="toss-info-list">
                  <div className="toss-info-item">
                    <span className="dot" />
                    토스 앱 없이도 카드로 간편하게 결제할 수 있습니다.
                  </div>
                  <div className="toss-info-item">
                    <span className="dot" />
                    토스머니, 계좌이체, 신용/체크카드 모두 지원합니다.
                  </div>
                  <div className="toss-info-item">
                    <span className="dot" />
                    결제 후 즉시 주문이 확정됩니다.
                  </div>
                </div>
              </TossPayInfoBox>
              <TossPayButton id="btn-toss-pay" onClick={() => handleGeneralPayment('toss')} disabled={isTossProcessing}>
                <span className="toss-logo-text">toss</span>
                로 {totalPrice.toLocaleString()}원 결제하기
              </TossPayButton>
            </>
          )}

          {/* 일반 결제 버튼 (토스 외) */}
          {method !== 'toss' && (
            <SubmitButton onClick={() => handleGeneralPayment(method)} style={{ marginTop: '0' }} disabled={isTossProcessing}>
              결제 완료하기
            </SubmitButton>
          )}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>,
    document.querySelector('.service-panel') || document.body
  );
};

// ==========================================
// 9. ORDER & REFUND HISTORY MODAL
// ==========================================
export interface OrderHistoryModalProps {
  onClose: () => void;
}

const HistoryTabGroup = styled.div`
  display: flex;
  border-bottom: 1.5px solid #10202b;
  margin-bottom: 16px;
`;

const HistoryTabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: 14px;
  color: ${({ $isActive }) => ($isActive ? '#10202b' : '#94a3b8')};
  border-bottom: ${({ $isActive }) => ($isActive ? '3px solid #10202b' : '3px solid transparent')};
  margin-bottom: -1.5px;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.15s ease;

  &:hover {
    color: #10202b;
  }
`;

const OrderHistoryCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #c8d3db;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 43, 73, 0.02);

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;

    .status-tag {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;

      &--delivered {
        background: #e2f9df;
        color: #1e7e34;
      }
      &--refunded {
        background: #ffe5e5;
        color: #d32f2f;
      }
      &--exchanged {
        background: #e5f6ff;
        color: #0288d1;
      }
    }
  }

  .card-mid {
    display: flex;
    gap: 12px;
    align-items: center;

    .img-box {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 4px;

      img {
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
      }
    }

    .info-box {
      display: flex;
      flex-direction: column;
      text-align: left;

      .title {
        font-family: ${({ theme }) => theme.fonts.jua};
        font-size: 13px;
        color: #10202b;
        font-weight: 400;
        margin-bottom: 3px;
      }

      .price {
        font-size: 14px;
        font-weight: 800;
        color: #10202b;
        margin-bottom: 2px;
      }

      .desc {
        font-size: 10px;
        color: #64748b;
      }
    }
  }
`;

interface HistoryItem {
  id: string;
  orderNo: string;
  date: string;
  name: string;
  image: string;
  price: string;
  option: string;
  status: 'delivered' | 'refunded' | 'exchanged';
}

const HISTORY_DATA: HistoryItem[] = [
  {
    id: 'h1',
    orderNo: 'AR-98320492',
    date: '2026.08.11',
    name: 'Powerskin Carbon Core FX Jammer',
    image: '/images/cruiser_evo.png',
    price: '₩ 450,000',
    option: 'Navy/Cyan - Size 30 / 1개',
    status: 'delivered'
  },
  {
    id: 'h2',
    orderNo: 'AR-92842019',
    date: '2026.07.28',
    name: 'Cobra Ultra Swipe Mirror',
    image: '/images/goggles.png',
    price: '₩ 68,000',
    option: 'Yellow Gopher - Free / 1개',
    status: 'delivered'
  },
  {
    id: 'h3',
    orderNo: 'AR-83920192',
    date: '2026.06.15',
    name: 'The One Mask',
    image: '/images/mask_one.png',
    price: '₩ 45,000',
    option: 'Smoke/White - Free / 1개',
    status: 'delivered'
  },
  {
    id: 'h4',
    orderNo: 'AR-72810921',
    date: '2026.05.10',
    name: 'Cruiser Evo',
    image: '/images/cruiser_evo.png',
    price: '₩ 20,000',
    option: 'Blue/Silver - Free / 1개',
    status: 'refunded'
  },
  {
    id: 'h5',
    orderNo: 'AR-61029312',
    date: '2026.04.05',
    name: 'Cobra Ultra Swipe Mirror',
    image: '/images/goggles.png',
    price: '₩ 68,000',
    option: 'Black - Free / 1개',
    status: 'exchanged'
  }
];

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ onClose }) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'delivered' | 'refunded'>('delivered');

  const filteredHistory = HISTORY_DATA.filter((item) => {
    if (activeTab === 'delivered') {
      return item.status === 'delivered';
    } else {
      return item.status === 'refunded' || item.status === 'exchanged';
    }
  });

  const getStatusLabel = (status: 'delivered' | 'refunded' | 'exchanged') => {
    if (status === 'delivered') return t('delivered');
    if (status === 'refunded') return t('refundComplete');
    return t('exchangeComplete');
  };

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{t('orderHistoryTitle')}</h3>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </ModalHeader>

        <ModalBody style={{ padding: '16px' }}>
          {/* 탭 버튼 */}
          <HistoryTabGroup>
            <HistoryTabButton
              $isActive={activeTab === 'delivered'}
              onClick={() => setActiveTab('delivered')}
            >
              {t('tabDelivered')}
            </HistoryTabButton>
            <HistoryTabButton
              $isActive={activeTab === 'refunded'}
              onClick={() => setActiveTab('refunded')}
            >
              {t('tabRefunded')}
            </HistoryTabButton>
          </HistoryTabGroup>

          {/* 내역 리스트 */}
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
              {t('emptyHistory')}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <OrderHistoryCard key={item.id}>
                <div className="card-top">
                  <span>{item.date} • {t('orderNo')} {item.orderNo}</span>
                  <span className={`status-tag status-tag--${item.status}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="card-mid">
                  <div className="img-box">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="info-box">
                    <span className="title">{item.name}</span>
                    <span className="price">{item.price}</span>
                    <span className="desc">{item.option}</span>
                  </div>
                </div>
              </OrderHistoryCard>
            ))
          )}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>,
    document.querySelector('.service-panel') || document.body
  );
};

