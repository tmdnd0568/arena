import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
`;

const InfoMediaBox = styled.div`
  width: 100%;
  height: 280px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: none;
  position: relative;
  overflow: hidden; /* scale(1.25) 이미지가 아래 텍스트 영역을 침범하지 않도록 */

  .info-media-box__main-img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transform: scale(1.25);
    transition: opacity 0.15s ease-in-out;
  }
`;

const InfoDetails = styled.section`
  padding: 24px 20px 80px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .info-details__category {
    font-size: 11px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.cyanDark};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-details__name {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    color: #10202b;
    font-weight: 400;
    line-height: 1.25;
    margin-bottom: 2px;
  }

  .info-details__rating {
    display: flex;
    align-items: center;
    gap: 6px;

    .stars {
      color: #f59e0b;
      font-size: 14px;
      letter-spacing: -1px;
    }

    .rating-text {
      font-size: 11px;
      color: #10202b;
      font-weight: 700;
    }
  }

  .info-details__price {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .price-orig {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.textFaint};
      text-decoration: line-through;
    }

    .price-discount {
      font-size: 18px;
      font-weight: 900;
      color: ${({ theme }) => theme.colors.navy};
    }
  }

  .info-details__desc {
    font-size: 13px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textMuted};
    border-bottom: 1.5px solid #eceff2;
    padding-bottom: 20px;
    margin-bottom: 8px;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1.5px solid #eceff2;
  padding-bottom: 20px;
  margin-bottom: 8px;

  .color-options__label {
    font-size: 12px;
    font-weight: 700;
    color: #10202b;

    strong {
      color: ${({ theme }) => theme.colors.cyanDark};
    }
  }

  .color-chips {
    display: flex;
    gap: 8px;
  }
`;

const ColorChip = styled.button<{ $colorCode: string; $isActive: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid ${({ $isActive }) => ($isActive ? '#10202b' : '#eceff2')};
  background-color: ${({ $colorCode }) => $colorCode};
  position: relative;
  transition: transform 0.15s ease, border-color 0.15s;

  &:hover {
    transform: scale(1.08);
  }

  ${({ $isActive }) =>
    $isActive &&
    `
      &::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
      }
    `}
`;

const DropdownSection = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: none;
  margin-bottom: 24px;
`;

const DropdownTrigger = styled.button<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: 15px;
  color: #10202b;
  font-weight: 400;

  .icon-arrow {
    transition: transform 0.28s ease;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const AccordionContent = styled.div<{ $isExpanded: boolean }>`
  overflow: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
  max-height: ${({ $isExpanded }) => ($isExpanded ? '1000px' : '0px')};
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const AccordionInner = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SpecAccordion = styled.div`
  border: 1.5px solid #10202b;
  border-radius: 12px;
  overflow: visible;
  position: relative;
  background: #ffffff;
`;

const SpecAccBtn = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border-radius: 12px;

  .label {
    font-size: 11px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textFaint};
    text-transform: uppercase;
    display: block;
    margin-bottom: 2px;
  }

  .val {
    font-size: 13px;
    font-weight: 700;
    color: #10202b;
  }

  .icon {
    transition: transform 0.2s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const SpecSelectList = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1.5px solid #10202b;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 43, 73, 0.12);
  z-index: 10;
  margin-top: 4px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  list-style: none;
  overflow: hidden;
`;

const SpecSelectItem = styled.li<{ $isActive: boolean }>`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.cyanDark : '#10202B')};
  background-color: ${({ $isActive }) => ($isActive ? '#f0f9ff' : 'transparent')};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const DeliveryContent = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  text-align: left;
  background: #f8fafc;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;

  p strong {
    color: #10202b;
  }
`;

const SubmitCartButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: 1.5px solid #10202b;
  background: #00d0ff;
  color: #002b49;
  font-weight: 900;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 0 #10202b;
  transition: transform 0.1s, box-shadow 0.1s;
  margin-bottom: 40px;

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0px 0 #10202b;
  }
`;

interface ProductDetailData {
  index: number;
  image: string;
  category: string;
  name: string;
  stars: number;
  reviews: string;
  priceOrig: number;
  priceDiscount: number;
  desc: string;
  lens: string;
  seal: string;
  strap: string;
  antifog: string;
}

const PRODUCT_DETAILS_DATA: ProductDetailData[] = [
  {
    index: 0,
    image: '/images/goggles.png',
    category: '선수용 수경',
    name: 'Cobra Ultra Swipe',
    stars: 4,
    reviews: '(128 리뷰)',
    priceOrig: 750000,
    priceDiscount: 680000,
    desc: '최고의 레이싱 수경. 스와이프 안티포그 기술이 적용된 이 프리미엄 미러 수경은 비할 데 없는 시야, 감소된 저항, 그리고 경쟁력 있는 수영 선수를 위한 안정적인 착용감을 제공합니다.',
    lens: '미러 폴리카보네이트',
    seal: '일본산 TPE',
    strap: '듀얼 실리콘',
    antifog: '스와이프 기술 (10배 더 오래 지속)',
  },
  {
    index: 1,
    image: '/images/mask_one.png',
    category: '오픈워터 마스크',
    name: 'The One Mask',
    stars: 4,
    reviews: '(95 리뷰)',
    priceOrig: 500000,
    priceDiscount: 450000,
    desc: '넓은 시야각의 오픈 워터 마스크. 편안한 피팅감과 탁월한 밀착력으로 어떠한 얼굴 형상에도 자연스럽게 밀착되어 누수를 완벽하게 차단해 줍니다.',
    lens: '클리어 폴리카보네이트',
    seal: '액체 실리콘 Orbit',
    strap: '이지 어드저스트 스트랩',
    antifog: '기본 김서림 방지 코팅',
  },
  {
    index: 2,
    image: '/images/cruiser_evo.png',
    category: '피트니스 수경',
    name: 'Cruiser Evo',
    stars: 4,
    reviews: '(210 리뷰)',
    priceOrig: 250000,
    priceDiscount: 200000,
    desc: '클래식 피트니스 수경. 수영을 즐기는 모든 레저 및 피트니스 수영인을 위해 편안한 소프트 실리콘 가스켓과 부드러운 안착감을 최우선으로 설계한 수경입니다.',
    lens: '틴티드 폴리카보네이트',
    seal: '소프트 실리콘',
    strap: '유니버셜 스플릿 스트랩',
    antifog: '친수성 안티포그 코팅',
  },
  {
    index: 3,
    image: '/images/air_speed.png',
    category: '레이싱 수경',
    name: 'Air Speed Mirror',
    stars: 4,
    reviews: '(156 리뷰)',
    priceOrig: 700000,
    priceDiscount: 600000,
    desc: '벌집 모양 씰 기술이 탑재된 하이 퍼포먼스 레이싱 수경. 안면부의 수압 저항을 혁신적으로 낮춰 스피드 극대화에 공헌하는 최정상급 고글 수경입니다.',
    lens: '미러 폴리카보네이트',
    seal: '허니콤(벌집) 소프트 TPE',
    strap: '레이싱 듀얼 실리콘',
    antifog: '고성능 김서림 방지 기술',
  },
];

const COLOR_CHIPS_DATA = [
  { name: '블루', code: '#0066cc' },
  { name: '레드', code: '#cc3333' },
  { name: '그린', code: '#339966' },
  { name: '블랙', code: '#1a1a1a' },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useApp();

  const prodIdx = id ? parseInt(id, 10) : 0;
  const product = PRODUCT_DETAILS_DATA[prodIdx] || PRODUCT_DETAILS_DATA[0];

  // UI 상태 관리
  const [selectedColor, setSelectedColor] = useState('블루');
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(true);
  const [isDeliveryExpanded, setIsDeliveryExpanded] = useState(false);
  const [activeSpecDropdown, setActiveSpecDropdown] = useState<'lens' | 'seal' | 'strap' | null>(null);

  // 옵션별 선택값 관리 (초기값은 상품 데이터 연동)
  const [lensVal, setLensVal] = useState(product.lens);
  const [sealVal, setSealVal] = useState(product.seal);
  const [strapVal, setStrapVal] = useState(product.strap);

  // 상품이 바뀔 때 마다 옵션 초기값 동기화
  useEffect(() => {
    setLensVal(product.lens);
    setSealVal(product.seal);
    setStrapVal(product.strap);
  }, [product]);

  const handleSpecSelect = (type: 'lens' | 'seal' | 'strap', val: string) => {
    if (type === 'lens') setLensVal(val);
    if (type === 'seal') setSealVal(val);
    if (type === 'strap') setStrapVal(val);
    setActiveSpecDropdown(null);
  };

  const handleToggleDropdown = (type: 'lens' | 'seal' | 'strap') => {
    setActiveSpecDropdown((prev) => (prev === type ? null : type));
  };

  const handleAddToCart = () => {
    const optionText = `수경 · ${selectedColor} / ${lensVal.split(' ')[0]}`;
    addToCart({
      id: `cart-item-${product.index}`,
      name: product.name,
      price: product.priceDiscount,
      color: optionText,
      image: product.image,
    });
    alert(
      `[장바구니 담기 성공]\n상품명: ${product.name}\n색상: ${selectedColor}\n가격: ${product.priceDiscount.toLocaleString()}원\n옵션: ${optionText}\n\n장바구니에 정상적으로 추가되었습니다.`
    );
  };

  return (
    <Container>
      {/* 메인 상품 이미지 */}
      <InfoMediaBox>
        <img
          src={product.image}
          alt={product.name}
          className="info-media-box__main-img"
        />
      </InfoMediaBox>

      {/* 디테일 정보 바디 */}
      <InfoDetails>
        <span className="info-details__category">{product.category}</span>
        <h2 className="info-details__name">{product.name}</h2>

        {/* 평점 */}
        <div className="info-details__rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx} className={idx < product.stars ? 'fill' : 'empty'}>
                {idx < product.stars ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="rating-text">{product.reviews}</span>
        </div>

        {/* 가격 */}
        <div className="info-details__price">
          <span className="price-orig">{product.priceOrig.toLocaleString()}원</span>
          <span className="price-discount">할인가:{product.priceDiscount.toLocaleString()}원</span>
        </div>

        <p className="info-details__desc">{product.desc}</p>

        {/* 색상 옵션 */}
        <ColorOptions>
          <span className="color-options__label">
            색상: <strong>{selectedColor}</strong>
          </span>
          <div className="color-chips">
            {COLOR_CHIPS_DATA.map((chip) => (
              <ColorChip
                key={chip.name}
                $colorCode={chip.code}
                $isActive={selectedColor === chip.name}
                onClick={() => setSelectedColor(chip.name)}
                aria-label={`${chip.name} 선택`}
              />
            ))}
          </div>
        </ColorOptions>

        {/* 드롭다운 아코디언 섹션 (상세 옵션) */}
        <DropdownSection>
          <DropdownTrigger
            $isExpanded={isOptionsExpanded}
            onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
            aria-expanded={isOptionsExpanded}
          >
            <span>상세 옵션 설정</span>
            <svg
              className="icon-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </DropdownTrigger>
          <AccordionContent $isExpanded={isOptionsExpanded}>
            <AccordionInner>
              {/* 1. 렌즈 아코디언 */}
              <SpecAccordion className="spec-accordion">
                <SpecAccBtn
                  $isOpen={activeSpecDropdown === 'lens'}
                  onClick={() => handleToggleDropdown('lens')}
                  aria-expanded={activeSpecDropdown === 'lens'}
                >
                  <div className="text-box">
                    <span className="label">렌즈 타입</span>
                    <span className="val">{lensVal}</span>
                  </div>
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </SpecAccBtn>
                <SpecSelectList $isOpen={activeSpecDropdown === 'lens'}>
                  <SpecSelectItem
                    $isActive={lensVal === '미러 폴리카보네이트'}
                    onClick={() => handleSpecSelect('lens', '미러 폴리카보네이트')}
                  >
                    미러 폴리카보네이트
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={lensVal === '클리어 폴리카보네이트'}
                    onClick={() => handleSpecSelect('lens', '클리어 폴리카보네이트')}
                  >
                    클리어 폴리카보네이트
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={lensVal === '틴티드 폴리카보네이트'}
                    onClick={() => handleSpecSelect('lens', '틴티드 폴리카보네이트')}
                  >
                    틴티드 폴리카보네이트
                  </SpecSelectItem>
                </SpecSelectList>
              </SpecAccordion>

              {/* 2. 가스켓 씰 아코디언 */}
              <SpecAccordion className="spec-accordion">
                <SpecAccBtn
                  $isOpen={activeSpecDropdown === 'seal'}
                  onClick={() => handleToggleDropdown('seal')}
                  aria-expanded={activeSpecDropdown === 'seal'}
                >
                  <div className="text-box">
                    <span className="label">가스켓 씰</span>
                    <span className="val">{sealVal}</span>
                  </div>
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </SpecAccBtn>
                <SpecSelectList $isOpen={activeSpecDropdown === 'seal'}>
                  <SpecSelectItem
                    $isActive={sealVal === '일본산 TPE'}
                    onClick={() => handleSpecSelect('seal', '일본산 TPE')}
                  >
                    일본산 TPE
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={sealVal === '액체 실리콘 Orbit'}
                    onClick={() => handleSpecSelect('seal', '액체 실리콘 Orbit')}
                  >
                    액체 실리콘 Orbit
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={sealVal === '소프트 실리콘'}
                    onClick={() => handleSpecSelect('seal', '소프트 실리콘')}
                  >
                    소프트 실리콘
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={sealVal === '허니콤(벌집) 소프트 TPE'}
                    onClick={() => handleSpecSelect('seal', '허니콤(벌집) 소프트 TPE')}
                  >
                    허니콤(벌집) 소프트 TPE
                  </SpecSelectItem>
                </SpecSelectList>
              </SpecAccordion>

              {/* 3. 스트랩 아코디언 */}
              <SpecAccordion className="spec-accordion">
                <SpecAccBtn
                  $isOpen={activeSpecDropdown === 'strap'}
                  onClick={() => handleToggleDropdown('strap')}
                  aria-expanded={activeSpecDropdown === 'strap'}
                >
                  <div className="text-box">
                    <span className="label">스트랩 밴드</span>
                    <span className="val">{strapVal}</span>
                  </div>
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </SpecAccBtn>
                <SpecSelectList $isOpen={activeSpecDropdown === 'strap'}>
                  <SpecSelectItem
                    $isActive={strapVal === '듀얼 실리콘'}
                    onClick={() => handleSpecSelect('strap', '듀얼 실리콘')}
                  >
                    듀얼 실리콘
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={strapVal === '이지 어드저스트 스트랩'}
                    onClick={() => handleSpecSelect('strap', '이지 어드저스트 스트랩')}
                  >
                    이지 어드저스트 스트랩
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={strapVal === '유니버셜 스플릿 스트랩'}
                    onClick={() => handleSpecSelect('strap', '유니버셜 스플릿 스트랩')}
                  >
                    유니버셜 스플릿 스트랩
                  </SpecSelectItem>
                  <SpecSelectItem
                    $isActive={strapVal === '레이싱 듀얼 실리콘'}
                    onClick={() => handleSpecSelect('strap', '레이싱 듀얼 실리콘')}
                  >
                    레이싱 듀얼 실리콘
                  </SpecSelectItem>
                </SpecSelectList>
              </SpecAccordion>

              {/* 4. 안티포그 (비드롭다운 고정 정보) */}
              <SpecAccordion className="spec-accordion">
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column' }}>
                  <span className="label" style={{ fontSize: '11px', fontWeight: 800, color: '#9AACB8', textTransform: 'uppercase', marginBottom: '2px' }}>
                    김서림 방지 (Anti-Fog)
                  </span>
                  <span className="val" style={{ fontSize: '13px', fontWeight: 700, color: '#10202B' }}>
                    {product.antifog}
                  </span>
                </div>
              </SpecAccordion>
            </AccordionInner>
          </AccordionContent>
        </DropdownSection>

        {/* 배송 및 반품 아코디언 */}
        <DropdownSection style={{ borderBottom: '1.5px solid #eceff2', marginBottom: '20px' }}>
          <DropdownTrigger
            $isExpanded={isDeliveryExpanded}
            onClick={() => setIsDeliveryExpanded(!isDeliveryExpanded)}
            aria-expanded={isDeliveryExpanded}
          >
            <span>배송 및 반품 안내</span>
            <svg
              className="icon-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </DropdownTrigger>
          <AccordionContent $isExpanded={isDeliveryExpanded}>
            <div style={{ paddingBottom: '20px' }}>
              <DeliveryContent>
                <p>
                  <strong>무료 배송</strong>
                  <br />
                  아레나 코리아 공식 쇼핑몰 회원은 전 상품 무료 배송 및 무료 반품 서비스를 제공합니다.
                </p>
                <p>
                  <strong>반품 절차</strong>
                  <br />
                  마이페이지의 주문 목록 메뉴에서 교환/반품 버튼을 통해 클릭 한 번으로 수거 신청이 접수됩니다. (교환 시 무상 진행)
                </p>
              </DeliveryContent>
            </div>
          </AccordionContent>
        </DropdownSection>

        {/* 장바구니 담기 버튼 */}
        <SubmitCartButton onClick={handleAddToCart} id="btn-submit-cart">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" />
          </svg>
          장바구니 담기
        </SubmitCartButton>
      </InfoDetails>
    </Container>
  );
};

export default ProductDetail;
