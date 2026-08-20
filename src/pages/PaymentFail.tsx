import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FailContainer = styled.div`
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

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #ef4444;
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

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1.5px solid #fee2e2;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;

  .label {
    color: #b91c1c;
    font-weight: 600;
    min-width: 80px;
  }

  .value {
    color: #10202b;
    font-weight: 700;
    word-break: break-all;
    flex: 1;
    text-align: right;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 14px;
  border: 1.5px solid #10202b;
  background: ${({ $primary }) => ($primary ? '#00d0ff' : '#ffffff')};
  color: #002b49;
  font-family: ${({ theme }) => theme.fonts.jua};
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  box-shadow: 0 4px 0 #10202b;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#00bce6' : '#f8fafc')};
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #10202b;
  }
`;

const PaymentFail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <FailContainer>
      <Card>
        <ErrorIcon>!</ErrorIcon>
        <Title>결제에 실패하였습니다</Title>
        <Description>
          주문 진행 중 오류가 발생했거나 결제가 취소되었습니다.<br />
          아래 실패 원인을 확인해 주세요.
        </Description>

        <ErrorBox>
          <ErrorRow>
            <span className="label">에러 코드</span>
            <span className="value">{code || 'UNKNOWN_ERROR'}</span>
          </ErrorRow>
          <ErrorRow>
            <span className="label">실패 사유</span>
            <span className="value">{message || '알 수 없는 이유로 결제가 실패했습니다.'}</span>
          </ErrorRow>
        </ErrorBox>

        <ButtonGroup>
          <ActionButton onClick={() => navigate('/basket')}>
            장바구니로
          </ActionButton>
          <ActionButton $primary onClick={() => navigate('/basket')}>
            결제 재시도
          </ActionButton>
        </ButtonGroup>
      </Card>
    </FailContainer>
  );
};

export default PaymentFail;
