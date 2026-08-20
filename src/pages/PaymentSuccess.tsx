import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useApp } from '../context/AppContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
  background: #f8fafc;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1.5px solid #10202b;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 43, 73, 0.15);
  padding: 32px 24px;
  text-align: center;
  box-sizing: border-box;
`;

const CheckCircle = styled.div`
  width: 64px;
  height: 64px;
  background: #0064FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: 24px;
  color: #10202b;
  margin: 0 0 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #64798a;
  margin: 0 0 24px;
  font-weight: 500;
  line-height: 1.5;
`;

const InfoTable = styled.div`
  background: #f0f6ff;
  border: 1.5px solid #c2d9ff;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  .label {
    color: #4a6fa5;
    font-weight: 600;
  }

  .value {
    color: #10202b;
    font-weight: 800;
    word-break: break-all;
    max-width: 65%;
    text-align: right;
  }
`;

const HomeButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: 1.5px solid #10202b;
  background: #00d0ff;
  color: #002b49;
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  box-shadow: 0 4px 0 #10202b;
  transition: all 0.15s ease;

  &:hover {
    background: #00bce6;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #10202b;
  }
`;

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useApp();

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // 결제 성공 진입 시 장바구니를 비웁니다.
    clearCart();
  }, [clearCart]);

  return (
    <SuccessContainer>
      <Card>
        <CheckCircle>✓</CheckCircle>
        <Title>결제가 성공적으로 완료되었습니다!</Title>
        <Description>
          토스페이먼츠를 통한 결제가 완료되었습니다.<br />
          아래 결제 내역을 확인해 주세요.
        </Description>

        <InfoTable>
          <InfoRow>
            <span className="label">결제 금액</span>
            <span className="value" style={{ color: '#0064FF', fontSize: '16px', fontWeight: 900 }}>
              {amount ? Number(amount).toLocaleString() : '0'}원
            </span>
          </InfoRow>
          <InfoRow>
            <span className="label">주문 번호</span>
            <span className="value">{orderId || '-'}</span>
          </InfoRow>
          <InfoRow>
            <span className="label">결제 키 (Key)</span>
            <span className="value" style={{ fontSize: '11px', color: '#64798a' }}>{paymentKey || '-'}</span>
          </InfoRow>
        </InfoTable>

        <HomeButton onClick={() => navigate('/')}>
          홈으로 돌아가기
        </HomeButton>
      </Card>
    </SuccessContainer>
  );
};

export default PaymentSuccess;
