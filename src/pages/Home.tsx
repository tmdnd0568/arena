import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandStoryModal } from '../components/Modals';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeroBanner = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 480px; /* 이미지가 넉넉히 다 보이도록 높이 조절 */
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.white};

  @media ${({ theme }) => theme.media.mobile} {
    height: 400px;
    padding: 32px 20px;
  }

  .hero-banner__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    position: absolute;
    inset: 0;
    z-index: 1; /* 가장 아래 레이어 */
  }

  .hero-banner__bg {
    position: absolute;
    inset: 0;
    z-index: 2; /* 이미지 위, 글자 아래 */
    background: linear-gradient(180deg, rgba(16, 32, 43, 0.1) 0%, rgba(16, 32, 43, 0.45) 100%);
  }

  .hero-banner__badge {
    position: relative;
    z-index: 3;
    display: inline-block;
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.12); /* FFFFFF 10% 셋팅 완벽 반영한 반투명 뱃지 */
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 20px;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    margin-bottom: 12px;
  }

  .hero-banner__title {
    position: relative;
    z-index: 3;
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.8rem, 5vw + 0.5rem, 2.4rem);
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  .hero-banner__desc {
    position: relative;
    z-index: 3;
    font-size: clamp(0.8rem, 1.6vw + 0.1rem, 0.9rem);
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 700;
    margin-bottom: 24px;
    max-width: 320px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  .hero-banner__cta {
    position: relative;
    z-index: 3;
    align-self: flex-start;
    padding: 10px 24px;
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1.5px solid #ffffff; /* 흰색 테두리 */
    background: transparent; /* 투명 배경 */
    color: #ffffff;
    font-weight: 800;
    font-size: 13px;
    box-shadow: none;
    transition: background-color 0.2s, transform 0.2s;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
  }
`;

const TabBar = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  padding: 12px 0;

  .tab-scroll {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: scroll;
    overflow-y: visible;
    scrollbar-width: none;
    padding: 2px 20px;

    &::-webkit-scrollbar {
      display: none;
    }

    @media ${({ theme }) => theme.media.mobile} {
      padding: 2px 16px;
    }
  }

  .tab {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 10px 18px 8px; /* Jua 폰트의 하단 쏠림 현상을 완벽하게 보정하는 미세 패딩 */
    background: #ffffff;
    border: 1.5px solid #10202b;
    border-radius: 14px;
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 14px;
    font-weight: 400;
    color: #004b87;
    white-space: nowrap;
    box-shadow: 0 4px 8px rgba(16, 32, 43, 0.08);
    transition: background-color 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
    cursor: pointer;

    &:hover {
      border-color: #10202b;
      background-color: #f8fafc;
    }

    &--active {
      background: #adc8ff !important;
      border-color: #10202b !important;
      color: #10202b !important;
    }

    &:focus-visible {
      outline: none;
      border-color: ${({ theme }) => theme.colors.cyan};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.cyan};
    }
  }
`;

const ProductSection = styled.section`
  padding: 6px 20px 28px;
  background: ${({ theme }) => theme.colors.white};

  .product-section__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: clamp(14px, 2.2vw, 20px);
  }

  .product-section__title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.4rem, 4vw + 0.3rem, 1.9rem);
    line-height: 1.15;
    font-weight: 400;

    .title-new {
      color: ${({ theme }) => theme.colors.cyan};
    }
    
    .title-arrivals {
      color: ${({ theme }) => theme.colors.navy};
    }
  }

  .view-all {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textFaint};
    letter-spacing: 0.05em;
    transition: color 0.15s;

    &:hover {
      color: #000000 !important;
    }

    .icon-chevron {
      width: 12px;
      height: 12px;
    }
  }

  @media ${({ theme }) => theme.media.mobile} {
    padding: 4px 12px 20px;
  }
`;

const ProductListWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  list-style: none;

  .full-width-card {
    grid-column: span 2;
  }

  @media ${({ theme }) => theme.media.mobile} {
    gap: 16px;
  }
`;

const ProductCard = styled.li`
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  border: none;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    .product-card__media {
      border-color: #000000;
    }
    .product-illust {
      transform: scale(1.06);
    }
  }

  .product-card__media {
    width: 100%;
    height: 180px;
    background: #f5fafd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;

    @media ${({ theme }) => theme.media.mobile} {
      height: 130px;
    }

    .product-illust {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: multiply;
      transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
  }

  &.full-width-card .product-card__media {
    height: 220px;

    @media ${({ theme }) => theme.media.mobile} {
      height: 160px;
    }
  }

  .product-card__body {
    padding: 12px 0 0;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .product-card__info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 4px;
  }

  .product-card__name {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(0.88rem, 1.8vw + 0.3rem, 1.05rem);
    font-weight: 400;
    color: ${({ theme }) => theme.colors.cyanDark};
    margin: 0;
  }

  .product-card__price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-shrink: 0;

    .price--original {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.textFaint};
      text-decoration: line-through;
    }

    .price--sale {
      font-size: 13px;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.navy};
    }
  }

  .product-card__desc {
    font-size: 11px;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 4px;
  }
`;

const LikeButton = styled.button<{ $isLiked: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isLiked }) => ($isLiked ? '#FF4B4B' : '#10202b')};
  transition: transform 0.15s ease, color 0.15s;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BrandCarousel = styled.section`
  width: 100%;
  padding-bottom: 8px;
  background: ${({ theme }) => theme.colors.white};

  .brand-carousel__slide {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 4 / 4;
    display: flex;
    align-items: flex-end;
    padding: clamp(20px, 5vw, 32px) clamp(16px, 4vw, 28px);

    @media ${({ theme }) => theme.media.mobile} {
      aspect-ratio: 4 / 5;
    }
  }

  .brand-carousel__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(160deg, ${({ theme }) => theme.colors.navyLight} 0%, ${({ theme }) => theme.colors.navy} 60%);
  }

  .brand-carousel__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.45;
    mix-blend-mode: luminosity;
  }

  .brand-carousel__content {
    position: relative;
    z-index: 1;
    text-align: left;
  }

  .brand-carousel__title {
    color: ${({ theme }) => theme.colors.white};
    font-size: clamp(1.2rem, 4vw + 0.3rem, 1.6rem);
    font-weight: 900;
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .brand-carousel__cta {
    margin-top: 14px;
    padding: 8px 16px;
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1.5px solid #ffffff;
    background: transparent;
    color: #ffffff;
    font-weight: 800;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
  }

  .brand-carousel__dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 12px 0;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.border};
      transition: width 0.2s, background-color 0.2s;

      &--active {
        width: 18px;
        border-radius: ${({ theme }) => theme.radii.pill};
        background: ${({ theme }) => theme.colors.cyan};
      }
    }
  }
`;

interface HomeProduct {
  index: number;
  id: string;
  name: string;
  category: 'racing' | 'openwater' | 'fitness';
  priceOriginal?: string;
  priceSale: string;
  desc?: string;
  image: string;
  isFullWidth: boolean;
  likeKey: string;
}

const HOME_PRODUCTS: HomeProduct[] = [
  {
    index: 0,
    id: 'cobra',
    name: 'COBRA ULTRA SWIPE',
    category: 'racing',
    priceOriginal: '850,000원',
    priceSale: '680,000원',
    desc: '물 속에서 최고의 스피드를 내기 위한 공기역학적 디자인과 진보된 안티포그 수경.',
    image: '/images/goggles.png',
    isFullWidth: true,
    likeKey: 'cobra'
  },
  {
    index: 1,
    id: 'mask',
    name: 'THE ONE MASK',
    category: 'openwater',
    priceSale: '450,000원',
    desc: '넓은 시야각의 오픈 워터 마스크.',
    image: '/images/mask_one.png',
    isFullWidth: true,
    likeKey: 'mask'
  },
  {
    index: 2,
    id: 'cruiser',
    name: 'CRUISER EVO',
    category: 'fitness',
    priceSale: '200,000원',
    image: '/images/cruiser_evo.png',
    isFullWidth: false,
    likeKey: 'cruiser'
  },
  {
    index: 3,
    id: 'airspeed',
    name: 'AIR SPEED MIRROR',
    category: 'racing',
    priceSale: '320,000원',
    image: '/images/air_speed.png',
    isFullWidth: false,
    likeKey: 'airspeed'
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { likedProducts, toggleLike, t } = useApp();
  const [currentFilter, setCurrentFilter] = useState<'all' | 'racing' | 'openwater' | 'fitness'>('all');
  const [isBrandStoryOpen, setIsBrandStoryOpen] = useState(false);

  const handleProductClick = (index: number) => {
    navigate(`/product/${index}`);
  };

  const handleTabClick = (filter: 'all' | 'racing' | 'openwater' | 'fitness') => {
    setCurrentFilter(filter);
  };

  const filteredProducts = HOME_PRODUCTS.filter(
    (product) => currentFilter === 'all' || product.category === currentFilter
  );

  return (
    <Container>
      {/* 히어로 배너 */}
      <HeroBanner aria-label="히어로 배너">
        <img src="/images/swimmer.png" alt="아레나 수영 선수" className="hero-banner__img" />
        <div className="hero-banner__bg" />
        <p className="hero-banner__badge">{t('newCollection')}</p>
        <h2 className="hero-banner__title">
          {t('designedForSpeed').split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < t('designedForSpeed').split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
        <p className="hero-banner__desc">{t('heroDesc')}</p>
        <Link className="hero-banner__cta" to="/products" id="btn-hero-cta">
          {t('shopRacing')}
        </Link>
      </HeroBanner>

      {/* 카테고리 필터 탭 */}
      <TabBar>
        <div className="tab-scroll">
          <button
            className={`tab ${currentFilter === 'all' ? 'tab--active' : ''}`}
            onClick={() => handleTabClick('all')}
          >
            {t('all')}
          </button>
          <button
            className={`tab ${currentFilter === 'racing' ? 'tab--active' : ''}`}
            onClick={() => handleTabClick('racing')}
          >
            {t('racing')}
          </button>
          <button
            className={`tab ${currentFilter === 'openwater' ? 'tab--active' : ''}`}
            onClick={() => handleTabClick('openwater')}
          >
            {t('openwaterTab')}
          </button>
          <button
            className={`tab ${currentFilter === 'fitness' ? 'tab--active' : ''}`}
            onClick={() => handleTabClick('fitness')}
          >
            {t('fitness')}
          </button>
        </div>
      </TabBar>

      {/* NEW ARRIVALS */}
      <ProductSection aria-label="신상품">
        <div className="product-section__head">
          <h2 className="product-section__title">
            <span className="title-new">NEW</span>
            <br />
            <span className="title-arrivals">ARRIVALS</span>
          </h2>
          <Link className="view-all" to="/products" id="link-view-all">
            VIEW ALL
            <svg className="icon-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ProductListWrapper>
          {filteredProducts.map((product) => {
            const isFull = currentFilter === 'all' && product.isFullWidth;
            return (
              <ProductCard
                key={product.id}
                className={isFull ? 'full-width-card' : ''}
                onClick={() => handleProductClick(product.index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-card__media">
                  <img src={product.image} alt={`${product.name} 수경`} className="product-illust" />
                  <LikeButton
                    $isLiked={likedProducts.includes(product.likeKey)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(product.likeKey);
                    }}
                    aria-label="찜하기"
                  >
                    <svg viewBox="0 0 24 24" fill={likedProducts.includes(product.likeKey) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                      <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
                    </svg>
                  </LikeButton>
                </div>
                <div className="product-card__body">
                  {isFull ? (
                    <>
                      <div className="product-card__info-row">
                        <p className="product-card__name">{product.name}</p>
                        <div className="product-card__price">
                          {product.priceOriginal && <span className="price--original">{product.priceOriginal}</span>}
                          <span className="price--sale">{product.priceSale}</span>
                        </div>
                      </div>
                      {product.desc && <p className="product-card__desc">{product.desc}</p>}
                    </>
                  ) : (
                    <>
                      <p className="product-card__name">{product.name}</p>
                      <div className="product-card__price" style={{ marginTop: '2px' }}>
                        <span className="price--sale">{product.priceSale}</span>
                      </div>
                    </>
                  )}
                </div>
              </ProductCard>
            );
          })}
        </ProductListWrapper>
      </ProductSection>

      {/* 브랜드스토리 캐러셀 */}
      <BrandCarousel aria-label="브랜드 스토리">
        <div className="brand-carousel__slide">
          <div className="brand-carousel__bg">
            <img src="/images/swimmer.png" alt="" className="brand-carousel__img" />
          </div>
          <div className="brand-carousel__content">
            <h3 className="brand-carousel__title">
              1973년, 프랑스의
              <br />
              Water Sports Brand로
              <br />
              탄생하다
            </h3>
            <button className="brand-carousel__cta" onClick={() => setIsBrandStoryOpen(true)}>
              브랜드 소개 바로가기
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </BrandCarousel>

      {isBrandStoryOpen && (
        <BrandStoryModal onClose={() => setIsBrandStoryOpen(false)} />
      )}
    </Container>
  );
};

export default Home;
