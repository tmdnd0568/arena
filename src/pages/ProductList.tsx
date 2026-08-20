import React from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #f8fafc;
  min-height: 100%;
`;

const CollectionHead = styled.div`
  padding: clamp(20px, 3.5vw, 28px) 16px 14px;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: none;
  text-align: left;

  .collection-title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.45rem, 3.8vw, 1.85rem);
    color: #10202b;
    font-weight: 400;
    margin-bottom: 6px;
    letter-spacing: -0.015em;
  }

  .collection-subtitle {
    font-size: clamp(0.72rem, 1.4vw + 0.1rem, 0.8rem);
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;

/*
 * 탭 바 해결책:
 * overflow-x:auto를 쓰면 브라우저가 overflow-y:visible을 auto로 강제 변환 (CSS 스펙)
 * → 탭 상하가 clip 됨. 해결: 탭 바를 display:flex로 배치하고
 *   부모를 scroll container가 아닌 단순 flex wrapper로 두어
 *   실제 스크롤은 마이너스 margin 트릭 없이 padding 공간을 활용
 */
const TabBar = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  /* 패딩을 위아래로 충분히 줘서 탭 버튼이 절대 잘리지 않게 */
  padding: 12px 0;

  /* 실제 스크롤 영역: 내부 ul이 담당 */
  .tab-scroll {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: scroll;
    overflow-y: visible;
    scrollbar-width: none;
    padding: 2px 20px; /* 좌우 패딩만, 위아래는 TabBar의 padding이 처리 */
    /* overflow-y:visible은 overflow-x:scroll과 함께 쓸 때 스펙상 auto로 변환됨.
       그러나 TabBar의 padding:12px 0이 clip boundary 바깥에 있으므로
       실제 탭 버튼은 TabBar의 패딩 영역 안에 있어 잘리지 않음. */

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

const CollectionProducts = styled.section`
  padding: 16px 20px 120px; /* 하단 스크롤 확보를 위해 패딩 증가 */
  flex: 1;

  @media ${({ theme }) => theme.media.mobile} {
    padding: 12px 12px 100px; /* 모바일 하단 탭바 높이(84px) 이상으로 여백 확보 */
  }
`;

const ProductGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  list-style: none;

  @media ${({ theme }) => theme.media.desktop} {
    /* 프리뷰 패널이 좁으므로 데스크탑에서도 1열로 자연스럽게 정렬 */
  }
`;

const ColCard = styled.li`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid #10202b;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(0, 43, 73, 0.15);
  }

  .col-card__media {
    width: 100%;
    height: 180px;
    background: #f5fafd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: none;
    overflow: hidden; /* scale(1.25) 이미지가 카드를 삐져나가지 않도록 */

    .badge-new {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #000000;
      color: #ffffff;
      font-family: ${({ theme }) => theme.fonts.jua};
      font-weight: 400;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #000000;
    }

    .col-illust {
      width: 100%;
      height: 100%;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
  }

  .col-card__body {
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 1;
  }

  .col-card__name {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 17px;
    color: #10202b;
    font-weight: 400;
    margin-bottom: 6px;
  }

  .col-card__desc {
    font-size: 12px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 12px;
  }

  .col-card__rating {
    font-size: 12px;
    font-weight: 700;
    color: #10202b;
    margin-bottom: 12px;
  }

  /* 스펙 테이블 */
  .col-card__specs {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 10px 0;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .spec-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      line-height: 1.4;

      .spec-label {
        color: ${({ theme }) => theme.colors.textFaint};
        font-weight: 500;
      }

      .spec-val {
        color: #10202b;
        font-weight: 700;

        &--rating {
          color: #009fdb;
        }
      }
    }
  }

  .col-card__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .col-card__price-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .price-orig {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.textFaint};
      text-decoration: line-through;
      margin-bottom: 1px;
    }

    .price-discount {
      font-size: 15px;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.navy};
    }
  }

  .btn-add-cart {
    width: 38px;
    height: 38px;
    border-radius: 30px 30px 30px 0;
    border: 1.5px solid #000000;
    background: #00d0ff;
    color: #002b49;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    transition: transform 0.15s, background-color 0.15s;

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const LikeButton = styled.button<{ $isLiked: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isLiked }) => ($isLiked ? '#FF4B4B' : '#10202B')};
  box-shadow: 0 2px 8px rgba(0, 43, 73, 0.1);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RatingWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .star-yellow {
    color: #ffb800;
  }

  .rating-text {
    color: #10202b;
    font-weight: 700;
  }
`;

interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  priceOrig?: number;
  priceDiscount: number;
  image: string;
  rating: string;
  specs?: { label: string; val: string }[];
  badge?: string;
  color: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: 'cobra',
    name: 'Cobra Ultra Swipe',
    category: 'racing',
    desc: '물 속에서 최고역 스피드를 내기 위한 공기역학적 디자인과 진보된 안티포그 스와이프 기술이 적용된 궁극의 레이싱 수경',
    priceOrig: 85000,
    priceDiscount: 68000,
    image: '/images/goggles.png',
    rating: '★ 4.9 (120)',
    color: '옐로우 고퍼 / 블랙',
    specs: [
      { label: '렌즈 타입', val: '미러' },
      { label: '핏', val: '로우 프로파일' },
      { label: '평점', val: '★ 4.9 (120)' },
    ],
    badge: 'NEW',
  },
  {
    id: 'mask',
    name: 'The One Mask',
    category: 'openwater',
    desc: '넓은 시야각의 오픈 워터 마스크. 편안한 피팅감과 탁월한 밀착력으로 어떠한 얼굴 형상에도 자연스럽게 밀착되어 누수를 완벽하게 차단해 줍니다.',
    priceOrig: 50000,
    priceDiscount: 45000,
    image: '/images/mask_one.png',
    color: '스모크 / 화이트',
    rating: '★ 4.7 (95)',
  },
  {
    id: 'cruiser',
    name: 'Cruiser Evo',
    category: 'fitness',
    desc: '클래식 피트니스 수경. 수영을 즐기는 모든 레저 및 피트니스 수영인을 위해 편안한 소프트 실리콘 가스켓과 부드러운 안착감을 최우선으로 설계한 수경입니다.',
    priceOrig: 25000,
    priceDiscount: 20000,
    image: '/images/cruiser_evo.png',
    color: '블루 / 실버',
    rating: '★ 4.5 (210)',
  },
  {
    id: 'airspeed',
    name: 'Air Speed Mirror',
    category: 'racing',
    desc: '벌집 모양 씰 기술이 탑재된 하이 퍼포먼스 레이싱 수경. 안면부의 수압 저항을 혁신적으로 낮춰 스피드 극대화에 공헌하는 최정상급 고글 수경입니다.',
    priceOrig: 70000,
    priceDiscount: 60000,
    image: '/images/air_speed.png',
    color: '레드 / 블랙',
    rating: '★ 4.8 (156)',
  },
];

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { likedProducts, toggleLike, addToCart, t } = useApp();

  const renderRating = (ratingStr: string) => {
    if (!ratingStr) return null;
    if (ratingStr.includes('★')) {
      const scoreText = ratingStr.replace('★', '').trim();
      return (
        <RatingWrapper>
          <span className="star-yellow">★</span>
          <span className="rating-text">{scoreText}</span>
        </RatingWrapper>
      );
    }
    return <span className="rating-text">{ratingStr}</span>;
  };

  const currentFilter = searchParams.get('filter') || 'all';

  const handleTabChange = (filter: string) => {
    setSearchParams({ filter });
  };

  const handleCardClick = (index: number) => {
    navigate(`/product/${index}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product, index: number) => {
    e.stopPropagation();
    addToCart({
      id: `cart-item-${index}`,
      name: product.name,
      price: product.priceDiscount * 10, // 원본 소스는 만단위이거나 혹은 콤마 에러 보정이 있으므로 context 가격과 일치시킴
      color: product.color,
      image: product.image,
    });
    alert(`[장바구니 추가] ${product.name} 상품이 장바구니에 담겼습니다.`);
  };

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    if (currentFilter === 'all') return true;
    return p.category === currentFilter;
  });

  const formatPrice = (price: number) => {
    // 기존 퍼블리싱 소스에서는 680,000원 등으로 표기되었음 (단가 보정)
    return (price * 10).toLocaleString() + '원';
  };

  return (
    <Container>
      {/* 콜렉션 헤더 */}
      <CollectionHead>
        <h2 className="collection-title">{t('goggleCollection')}</h2>
        <p className="collection-subtitle">
          {t('goggleCollectionDesc').split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < t('goggleCollectionDesc').split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </CollectionHead>

      {/* 카테고리 필터 탭 */}
      <TabBar>
        <div className="tab-scroll">
          <button
            className={`tab ${currentFilter === 'all' ? 'tab--active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            {t('all')}
          </button>
          <button
            className={`tab ${currentFilter === 'racing' ? 'tab--active' : ''}`}
            onClick={() => handleTabChange('racing')}
          >
            {t('racing')}
          </button>
          <button
            className={`tab ${currentFilter === 'openwater' ? 'tab--active' : ''}`}
            onClick={() => handleTabChange('openwater')}
          >
            {t('openwaterTab')}
          </button>
          <button
            className={`tab ${currentFilter === 'fitness' ? 'tab--active' : ''}`}
            onClick={() => handleTabChange('fitness')}
          >
            {t('fitness')}
          </button>
        </div>
      </TabBar>

      {/* 상품 목록 리스트 */}
      <CollectionProducts>
        <ProductGrid>
          {filteredProducts.map((product) => {
            // PRODUCTS_DATA 내의 원래 index 찾기 (디테일 페이지 연동용)
            const origIndex = PRODUCTS_DATA.findIndex((p) => p.id === product.id);

            return (
              <ColCard key={product.id} onClick={() => handleCardClick(origIndex)}>
                <div className="col-card__media">
                  {product.badge && <span className="badge-new">{product.badge}</span>}
                  <img src={product.image} alt={`${product.name} 수경`} className="col-illust" />
                  <LikeButton
                    $isLiked={likedProducts.includes(product.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(product.id);
                    }}
                    aria-label="찜하기"
                  >
                    <svg viewBox="0 0 24 24" fill={likedProducts.includes(product.id) ? '#FF4B4B' : 'none'} stroke={likedProducts.includes(product.id) ? '#FF4B4B' : 'currentColor'} strokeWidth="1.8">
                      <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" strokeLinejoin="round" />
                    </svg>
                  </LikeButton>
                </div>
                <div className="col-card__body">
                  <h3 className="col-card__name">{product.name}</h3>
                  <p className="col-card__desc">{product.desc}</p>

                  {/* 스펙 테이블 (Cobra Ultra Swipe인 경우에만 렌더링) */}
                  {product.specs ? (
                    <div className="col-card__specs">
                      {product.specs.map((spec, sIdx) => (
                        <div className="spec-row" key={sIdx}>
                          <span className="spec-label">{spec.label}</span>
                          <span className="spec-val">
                            {spec.label === '평점' ? renderRating(spec.val) : spec.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="col-card__rating">{renderRating(product.rating)}</div>
                  )}

                  <div className="col-card__bottom">
                    <div className="col-card__price-box">
                      {product.priceOrig && <span className="price-orig">{formatPrice(product.priceOrig)}</span>}
                      <span className="price-discount">
                        {product.priceOrig ? '할인가:' : ''}
                        {formatPrice(product.priceDiscount)}
                      </span>
                    </div>
                    <button
                      className="btn-add-cart"
                      onClick={(e) => handleAddToCart(e, product, origIndex)}
                      aria-label="장바구니 추가"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </ColCard>
            );
          })}
        </ProductGrid>
      </CollectionProducts>
    </Container>
  );
};

export default ProductList;
