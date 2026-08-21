import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ReturnRequestModal, SettingsModal, OrderHistoryModal } from '../components/Modals';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #f8fafc;
  min-height: 100%;
  text-align: left;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: #ffffff;
  min-height: 80vh;
  text-align: center;

  .login-card {
    max-width: 420px;
    width: 100%;
    padding: 40px 32px;
    border-radius: 24px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(0, 43, 73, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-img {
    height: 48px;
    object-fit: contain;
    mix-blend-mode: multiply;
    margin-bottom: 24px;
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 24px;
    color: #10202b;
    margin-bottom: 12px;
    font-weight: 400;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .login-button-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }

  .google-login-btn, .apple-login-btn {
    width: 100%;
    height: 52px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1.5px solid #cbd5e1;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .google-login-btn {
    background: #ffffff;
    color: #1f2937;

    &:hover {
      background: #f8fafc;
      border-color: #94a3b8;
      transform: translateY(-1px);
    }
  }

  .apple-login-btn {
    background: #000000;
    color: #ffffff;
    border-color: #000000;

    &:hover {
      background: #1f2937;
      border-color: #1f2937;
      transform: translateY(-1px);
    }
  }
`;

const HeaderSection = styled.div`
  padding: 28px 20px 10px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  .title-area {
    h2 {
      font-family: ${({ theme }) => theme.fonts.jua};
      font-size: 26px;
      color: #10202b;
      font-weight: 400;
      margin-bottom: 6px;
    }
    p {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const UserProfileCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #c8d3db;
  border-radius: 20px;
  padding: 20px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 43, 73, 0.04);
  gap: 16px;

  @media ${({ theme }) => theme.media.mobile} {
    margin: 0 12px;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${({ theme }) => theme.colors.cyan};
      background-color: #eceff2;
    }

    .meta {
      display: flex;
      flex-direction: column;
      
      .name-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .name {
          font-family: ${({ theme }) => theme.fonts.jua};
          font-size: 18px;
          color: #10202b;
          font-weight: 400;
        }

        .badge {
          font-size: 11px;
          background: rgba(0, 194, 255, 0.1);
          color: ${({ theme }) => theme.colors.cyanDark};
          padding: 2px 8px;
          border-radius: 99px;
          font-weight: 700;
        }
      }

      .email {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.textMuted};
        margin-top: 4px;
      }
    }
  }

  .logout-btn {
    padding: 8px 14px;
    border-radius: 12px;
    background: #f1f5f9;
    border: 1px solid #000000;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.35;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: center;
    white-space: pre-line;

    &:hover {
      background: #e2e8f0;
      color: #334155;
    }

    @media ${({ theme }) => theme.media.mobile} {
      width: 100%;
      align-self: stretch;
      margin-top: 8px;
      text-align: center;
    }
  }
`;

const ContentSection = styled.section`
  padding: 16px 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media ${({ theme }) => theme.media.mobile} {
    padding: 12px 12px 80px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .section-title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 17px;
    color: #10202b;
    font-weight: 400;
  }

  .view-all-link {
    font-size: 11px;
    font-weight: 800;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      color: #000000 !important;
    }
  }
`;

const OrderCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #c8d3db;
  border-radius: 20px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 43, 73, 0.04);

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 12px;
    font-size: 12px;
    font-weight: 700;
    color: #10202b;

    .status-badge {
      background: #eceff2;
      color: #10202b;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      margin-right: 8px;
    }

    .order-date-arrow {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #94a3b8;
      font-size: 13px;
    }
  }

  .order-info {
    display: flex;
    gap: 16px;
    align-items: center;

    .product-img-box {
      width: 72px;
      height: 72px;
      border-radius: 12px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 4px;

      img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }
    }

    .product-details {
      display: flex;
      flex-direction: column;
      text-align: left;

      .brand {
        font-size: 10px;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        margin-bottom: 2px;
      }

      .title {
        font-family: ${({ theme }) => theme.fonts.jua};
        font-size: 14px;
        color: #10202b;
        font-weight: 400;
        margin-bottom: 4px;
        line-height: 1.3;
      }

      .price {
        font-size: 15px;
        font-weight: 900;
        color: #10202b;
        margin-bottom: 2px;
      }

      .options {
        font-size: 11px;
        color: #64748b;
      }
    }
  }

  .review-box {
    background: #f1f5f9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .review-prompt {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
    }

    .star-row {
      display: flex;
      gap: 6px;
    }

    .star-btn {
      font-size: 22px;
      color: #cbd5e1;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.15s;

      &--active {
        color: #ffb800;
      }
    }
  }

  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    button {
      height: 40px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      transition: background-color 0.15s, border-color 0.15s;
    }

    .btn-return {
      background: #ffffff;
      border: 1.5px solid #c8d3db;
      color: #64748b;

      &:hover {
        background: #f8fafc;
        border-color: #94a3b8;
      }
    }

    .btn-review-submit {
      background: #ffffff;
      border: 1.5px solid #10202b;
      color: #10202b;

      &:hover {
        background: #eceff2;
      }
    }
  }
`;

const WishCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #c8d3db;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 43, 73, 0.04);
`;

const WishItemRow = styled.div<{ $isRemoving: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $isRemoving }) => ($isRemoving ? 0 : 1)};
  transform: ${({ $isRemoving }) => ($isRemoving ? 'translateX(20px)' : 'translateX(0)')};

  &:last-child {
    border-bottom: none;
  }

  .media {
    width: 50px;
    height: 50px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;

    img {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain;
    }
  }

  .body {
    flex: 1;
    cursor: pointer;

    h4 {
      font-size: 13px;
      font-weight: 700;
      color: #10202b;
      margin-bottom: 2px;
      text-align: left;
    }

    p {
      font-size: 11px;
      color: #94a3b8;
      text-align: left;
    }
  }

  .btn-heart-wish {
    color: #ff4b4b;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.1);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingCard = styled.button`
  width: 100%;
  background: #ffffff;
  border: 1.5px solid #c8d3db;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s, border-color 0.15s;
  box-shadow: 0 4px 12px rgba(0, 43, 73, 0.02);
  text-align: left;

  &:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.99);
  }

  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #eceff2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10202b;
    flex-shrink: 0;
  }

  .info {
    display: flex;
    flex-direction: column;

    .name {
      font-size: 14px;
      font-weight: 800;
      color: #10202b;
      margin-bottom: 2px;
    }

    .desc {
      font-size: 11px;
      color: #64748b;
    }
  }
`;

const WISH_WIDGET_DATA: Record<string, { name: string; image: string; code: string }> = {
  cobra: { name: 'Cobra Ultra Swipe Mirror', image: '/images/goggles.png', code: '주문 #AR-8B210 • 9월 28일' },
  mask: { name: 'Carbon Core FX Jammer', image: '/images/cruiser_evo.png', code: '주문 #AR-8B392 • 10월 12일' },
  cruiser: { name: 'Cruiser Evo', image: '/images/cruiser_evo.png', code: '주문 #AR-79450 • 11월 05일' },
  airspeed: { name: 'Air Speed Mirror', image: '/images/air_speed.png', code: '주문 #AR-82240 • 12월 01일' },
};

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { likedProducts, toggleLike, t, user, loading, loginWithGoogle, loginWithApple, logout } = useApp();

  // 리뷰 별점 상태
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // 찜 삭제 애니메이션용 로컬 상태
  const [removingWishIds, setRemovingWishIds] = useState<string[]>([]);

  // 교환/반품 모달 상태
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // 주문/환불 내역 모달 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // 설정 모달 상태
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleReturnClick = () => {
    setIsReturnModalOpen(true);
  };

  const handleSettingCardClick = (_tab: 'profile' | 'payment' | 'notification') => {
    setIsSettingsModalOpen(true);
  };

  const handleReviewSubmit = () => {
    if (selectedRating === 0) {
      alert('별점을 1점 이상 선택해주세요.');
      return;
    }
    alert(
      `[리뷰 등록 완료]\n\nPowerskin Carbon Core FX Jammer 상품에 ${selectedRating}점 별점과 함께 소중한 리뷰가 성공적으로 등록되었습니다.`
    );
  };

  const handleWishRemove = (id: string) => {
    setRemovingWishIds((prev) => [...prev, id]);

    setTimeout(() => {
      toggleLike(id);
      setRemovingWishIds((prev) => prev.filter((rId) => rId !== id));
      alert(`[관심장비 해제] '${WISH_WIDGET_DATA[id]?.name || id}' 상품이 찜 목록에서 해제되었습니다.`);
    }, 300);
  };

  const handleItemNavigate = (id: string) => {
    const idxMap: Record<string, number> = { airspeed: 3, cruiser: 2, mask: 1, cobra: 0 };
    navigate(`/product/${idxMap[id] ?? 0}`);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontSize: '15px', color: '#64748b' }}>
          로딩 중...
        </div>
      </Container>
    );
  }

  // 1. 비로그인 상태인 경우 로그인 화면 노출
  if (!user) {
    return (
      <Container>
        <LoginContainer>
          <div className="login-card">
            <img src="/images/arena_02.png" alt="ARENA Logo" className="logo-img" />
            <h3>{t('mypage')}</h3>
            <p>아레나 프리미엄 회원 서비스를 위해<br />원하시는 계정으로 로그인해 주세요.</p>
            
            <div className="login-button-group">
              {/* Google Login */}
              <button className="google-login-btn" onClick={loginWithGoogle}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.66-.35-1.36-.35-2.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google 계정으로 로그인
              </button>

              {/* Apple Login */}
              <button className="apple-login-btn" onClick={loginWithApple}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Apple 계정으로 로그인
              </button>
            </div>
          </div>
        </LoginContainer>
      </Container>
    );
  }

  // 관심장비 찜 목록 데이터가 비어있어도 예시를 보여주기 위한 처리
  const activeWishProducts = likedProducts.filter((id) => !removingWishIds.includes(id));
  const hasWishes = activeWishProducts.length > 0;
  const wishListToRender = hasWishes ? activeWishProducts : ['mask', 'cobra'];

  return (
    <Container>
      {/* 마이페이지 제목 헤더 */}
      <HeaderSection>
        <div className="title-area">
          <h2>{t('mypage')}</h2>
          <p>{t('myPageProfileSub')}</p>
        </div>
      </HeaderSection>

      {/* 2. 로그인된 사용자 프로필 카드 */}
      <UserProfileCard>
        <div className="user-info">
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            alt={`${user.displayName} 프로필`}
            className="avatar"
          />
          <div className="meta">
            <div className="name-row">
              <span className="name">{user.displayName || '아레나 회원'}</span>
              <span className="badge">Premium</span>
            </div>
            <span className="email">{user.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          로그<br />아웃
        </button>
      </UserProfileCard>

      <ContentSection>
        {/* 최근 주문 내역 카드 */}
        <OrderCard>
          <div className="order-header" onClick={() => setIsHistoryModalOpen(true)} style={{ cursor: 'pointer' }}>
            <div>
              <span className="status-badge">{t('delivered')}</span>
              <span>2026.08.11 {t('order')}</span>
            </div>
            <div className="order-date-arrow">&gt;</div>
          </div>

          <div className="order-info">
            <div className="product-img-box">
              <img src="/images/cruiser_evo.png" alt="Powerskin 수영복" />
            </div>
            <div className="product-details">
              <span className="brand">ARENA TECH</span>
              <span className="title">Powerskin Carbon Core FX Jammer</span>
              <span className="price">₩ 450,000</span>
              <span className="options">{t('option')}: Navy/Cyan - Size 30 / {t('quantity')}: 1{t('piece')}</span>
            </div>
          </div>

          {/* 구매 상품 만족도 별점 남기기 */}
          <div className="review-box">
            <span className="review-prompt">{t('reviewPrompt')}</span>
            <div className="star-row">
              {Array.from({ length: 5 }).map((_, idx) => {
                const starVal = idx + 1;
                const isLit = hoverRating > 0 ? starVal <= hoverRating : starVal <= selectedRating;

                return (
                  <button
                    key={idx}
                    className={`star-btn ${isLit ? 'star-btn--active' : ''}`}
                    onClick={() => setSelectedRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`별 ${starVal}개 만족도 선택`}
                  >
                    {isLit ? '★' : '☆'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 버튼 액션 그룹 */}
          <div className="button-group">
            <button className="btn-return" onClick={handleReturnClick}>
              {t('exchangeReturn')}
            </button>
            <button className="btn-review-submit" onClick={handleReviewSubmit}>
              {t('writeReview')}
            </button>
          </div>
        </OrderCard>

        {/* 관심 장비 (Wishlist) */}
        <div>
          <SectionHeader>
            <h3 className="section-title">{t('wishlist')}</h3>
            <span className="view-all-link" onClick={() => navigate('/products')}>{t('viewAll')} &gt;</span>
          </SectionHeader>
          <WishCard>
            {wishListToRender.map((id) => {
              const item = WISH_WIDGET_DATA[id];
              if (!item) return null;
              const isRemoving = removingWishIds.includes(id);

              return (
                <WishItemRow key={id} $isRemoving={isRemoving}>
                  <div className="media" onClick={() => handleItemNavigate(id)}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="body" onClick={() => handleItemNavigate(id)}>
                    <h4>{item.name}</h4>
                    <p>{item.code}</p>
                  </div>
                  <button className="btn-heart-wish" onClick={() => handleWishRemove(id)} aria-label="찜 해제">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" strokeLinejoin="round" />
                    </svg>
                  </button>
                </WishItemRow>
              );
            })}
          </WishCard>
        </div>

        {/* 설정 및 환경설정 (3개 개별 카드로 따로 분류) */}
        <div>
          <SectionHeader>
            <h3 className="section-title">{t('settingsSection')}</h3>
          </SectionHeader>
          <SettingsContainer>
            <SettingCard onClick={() => handleSettingCardClick('profile')}>
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="info">
                <span className="name">{t('accountDetails')}</span>
                <span className="desc">{t('accountDetailsDesc')}</span>
              </div>
            </SettingCard>

            <SettingCard onClick={() => handleSettingCardClick('payment')}>
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div className="info">
                <span className="name">{t('paymentMethods')}</span>
                <span className="desc">{t('paymentMethodsDesc')}</span>
              </div>
            </SettingCard>

            <SettingCard onClick={() => handleSettingCardClick('notification')}>
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="info">
                <span className="name">{t('notifications')}</span>
                <span className="desc">{t('notificationsDesc')}</span>
              </div>
            </SettingCard>
          </SettingsContainer>
        </div>
      </ContentSection>

      {/* 교환/반품 모달 */}
      {isReturnModalOpen && (
        <ReturnRequestModal onClose={() => setIsReturnModalOpen(false)} />
      )}

      {/* 설정 모달 */}
      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}

      {/* 주문/환불 내역 모달 */}
      {isHistoryModalOpen && (
        <OrderHistoryModal onClose={() => setIsHistoryModalOpen(false)} />
      )}
    </Container>
  );
};

export default MyPage;
