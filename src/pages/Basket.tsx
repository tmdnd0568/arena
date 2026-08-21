import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PaymentModal } from '../components/Modals';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #f8fafc;
  min-height: 100%;
`;

const TitleSection = styled.section`
  padding: 24px 20px 14px;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  text-align: left;

  .basket-title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: clamp(1.4rem, 3.8vw, 1.8rem);
    color: #10202b;
    font-weight: 400;
  }

  .basket-count {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.cyanDark};
  }
`;

const BasketProductsSection = styled.section`
  padding: 16px 20px 0;

  @media ${({ theme }) => theme.media.mobile} {
    padding: 12px 12px 0;
  }
`;

const BasketList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
`;

const BasketCard = styled.li<{ $isRemoving: boolean }>`
  display: flex;
  padding: 16px;
  border: 1.5px solid #10202b;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.card};
  gap: 16px;
  position: relative;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $isRemoving }) => ($isRemoving ? 0 : 1)};
  transform: ${({ $isRemoving }) => ($isRemoving ? 'scale(0.95)' : 'scale(1)')};

  .basket-card__media {
    width: 90px;
    height: 90px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    background: #ffffff;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .basket-illust {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
  }

  .basket-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .basket-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .basket-card__name {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 15px;
    color: #10202b;
    font-weight: 400;
  }

  .basket-card__option-text {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 12px;
  }

  .basket-card__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .basket-card__price {
    font-size: 14px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.navy};
  }

  /* 커스텀 체크박스 */
  .custom-checkbox {
    display: block;
    position: relative;
    padding-left: 22px;
    cursor: pointer;
    user-select: none;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 18px;
      width: 18px;
      background-color: #eee;
      border: 1.5px solid #10202b;
      border-radius: 4px;
      transition: background-color 0.2s;

      &::after {
        content: '';
        position: absolute;
        display: none;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }

    input:checked ~ .checkmark {
      background-color: #10b981; /* 피그마 초록색 체크박스 */
      border-color: #10202b;
    }

    input:checked ~ .checkmark::after {
      display: block;
    }
  }

  /* 수량 조절 버튼 */
  .quantity-control {
    display: inline-flex;
    align-items: center;
    border: 1.5px solid #10202b;
    border-radius: 8px;
    overflow: hidden;
    height: 28px;
    background: #ffffff;
    box-shadow: 0 2px 0 #10202b;

    .btn-qty {
      width: 26px;
      height: 100%;
      background: #f8fafc;
      font-size: 14px;
      font-weight: 700;
      color: #10202b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s;

      &:hover {
        background-color: #eceff2;
      }
    }

    .qty-num {
      padding: 0 10px;
      font-size: 13px;
      font-weight: 700;
      color: #10202b;
    }
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textFaint};

  .icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .btn-shop {
    display: inline-block;
    padding: 10px 24px;
    border: 1.5px solid #10202b;
    border-radius: 12px;
    background: #00d0ff;
    color: #002b49;
    font-weight: 800;
    font-size: 13px;
    box-shadow: 0 3px 0 #10202b;
    transition: transform 0.1s, box-shadow 0.1s;

    &:active {
      transform: translateY(3px);
      box-shadow: 0 0px 0 #10202b;
    }
  }
`;

const ClearCartRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding: 0 4px;

  .btn-clear {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    font-size: 11px;
    font-weight: 700;
    color: #8fa0ad;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    transition: all 0.18s ease-in-out;

    svg {
      color: #8fa0ad;
      transition: color 0.18s ease-in-out;
    }

    &:hover {
      color: #ff4d4d;
      background: rgba(255, 77, 77, 0.06);
      svg {
        color: #ff4d4d;
      }
    }
  }
`;

const BasketSummarySection = styled.section`
  padding: 24px 20px 32px;
  margin-top: 24px;
  background: ${({ theme }) => theme.colors.white};
  border-top: none;
  text-align: left;

  .summary-title {
    font-family: ${({ theme }) => theme.fonts.jua};
    font-size: 16px;
    color: #10202b;
    font-weight: 400;
    margin-bottom: 16px;
  }

  .summary-table {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;

      .label {
        color: ${({ theme }) => theme.colors.textMuted};
        font-weight: 500;
      }

      .val {
        color: #10202b;
        font-weight: 700;
      }

      &--total {
        font-size: 15px;
        border-top: 1px dashed ${({ theme }) => theme.colors.border};
        padding-top: 14px;
        margin-top: 2px;

        .label {
          color: #10202b;
          font-weight: 800;
        }

        .val {
          color: ${({ theme }) => theme.colors.navy};
          font-size: 18px;
          font-weight: 900;
        }
      }
    }
  }

  .btn-pay {
    width: 100%;
    height: 52px;
    border-radius: 14px;
    border: 1.5px solid #10202b;
    background: #00d0ff;
    color: #002b49;
    font-family: ${({ theme }) => theme.fonts.jua};
    font-weight: 400;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: none;
    transition: opacity 0.15s, transform 0.1s;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  @media ${({ theme }) => theme.media.mobile} {
    padding: 20px 12px 24px;
  }
`;

const Basket: React.FC = () => {
  const navigate = useNavigate();
  const { cartList, updateCartQty, removeCartItem, clearCart } = useApp();
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // 체크 해제(삭제) 인터랙션 처리
  const handleCheckboxChange = (id: string) => {
    // 체크를 해제하면 애니메이션 효과 후 카트에서 제거
    setRemovingIds((prev) => [...prev, id]);

    setTimeout(() => {
      removeCartItem(id);
      setRemovingIds((prev) => prev.filter((rId) => rId !== id));
    }, 300); // 300ms css 애니메이션 딜레이 동조
  };

  const handlePayClick = (finalTotal: number) => {
    if (finalTotal === 0) {
      alert('장바구니에 선택된 상품이 없습니다.\n상품을 선택한 후 결제해주세요.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    clearCart();
    // 결제 완료 시 alert(모달 페이지) 없이, 바로 성공 페이지로 이동
    navigate(`/payment/success?orderId=DIRECT-${Math.random().toString(36).substring(2, 11).toUpperCase()}&amount=${subtotal}`);
  };

  // 장바구니 계산 (전부 체크 해제된 항목 제외 및 합산)
  const checkedItems = cartList.filter((item) => !removingIds.includes(item.id));
  const subtotal = checkedItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  const handleClearCart = () => {
    if (window.confirm('장바구니의 모든 상품을 비우시겠습니까?')) {
      clearCart();
    }
  };

  return (
    <Container>
      {/* 타이틀 */}
      <TitleSection>
        <h2 className="basket-title">장바구니</h2>
        <span className="basket-count" id="cart-item-count">
          {checkedItems.length}개 상품
        </span>
      </TitleSection>

      {/* 상품 목록 */}
      <BasketProductsSection>
        {cartList.length === 0 ? (
          <EmptyCart>
            <div className="icon">🛒</div>
            <p>장바구니가 비어 있습니다.</p>
            <button className="btn-shop" onClick={() => navigate('/products')}>
              수경 쇼핑하기
            </button>
          </EmptyCart>
        ) : (
          <>
            <BasketList>
              {cartList.map((item) => {
                const isRemoving = removingIds.includes(item.id);

                return (
                  <BasketCard key={item.id} id={item.id} $isRemoving={isRemoving}>
                    <div className="basket-card__media">
                      <img src={item.image} alt={item.name} className="basket-illust" />
                    </div>
                    <div className="basket-card__body">
                      <div className="basket-card__header">
                        <h3 className="basket-card__name">{item.name}</h3>
                        {/* 초록색 둥근 체크박스 */}
                        <label className="custom-checkbox" aria-label="상품 선택">
                          <input
                            type="checkbox"
                            checked={!isRemoving}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <p className="basket-card__option-text">{item.color}</p>
                      <div className="basket-card__bottom">
                        {/* 수량 조절 버튼 */}
                        <div className="quantity-control">
                          <button
                            className="btn-qty btn-qty--minus"
                            onClick={() => updateCartQty(item.id, item.qty - 1)}
                            aria-label="수량 감소"
                          >
                            -
                          </button>
                          <span className="qty-num">{item.qty}</span>
                          <button
                            className="btn-qty btn-qty--plus"
                            onClick={() => updateCartQty(item.id, item.qty + 1)}
                            aria-label="수량 증가"
                          >
                            +
                          </button>
                        </div>
                        <span className="basket-card__price">
                          {(item.price * item.qty).toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </BasketCard>
                );
              })}
            </BasketList>
            <ClearCartRow>
              <button className="btn-clear" onClick={handleClearCart}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                장바구니 비우기
              </button>
            </ClearCartRow>
          </>
        )}
      </BasketProductsSection>

      {/* 주문 상세 요약 영역 */}
      <BasketSummarySection>
        <h3 className="summary-title">주문 상세 요약</h3>
        <div className="summary-table">
          <div className="summary-row">
            <span className="label">총 상품금액</span>
            <span className="val" id="summary-subtotal">
              {subtotal.toLocaleString()}원
            </span>
          </div>
          <div className="summary-row">
            <span className="label">배송비</span>
            <span className="val">무료</span>
          </div>
          <div className="summary-row summary-row--total">
            <span className="label">최종 결제 금액</span>
            <span className="val" id="summary-total">
              {subtotal.toLocaleString()}원
            </span>
          </div>
        </div>
        <button className="btn-pay" onClick={() => handlePayClick(subtotal)} id="btn-pay">
          결제하기
        </button>
      </BasketSummarySection>

      {isPaymentModalOpen && (
        <PaymentModal
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          totalPrice={subtotal}
          itemCount={checkedItems.length}
        />
      )}
    </Container>
  );
};

export default Basket;
