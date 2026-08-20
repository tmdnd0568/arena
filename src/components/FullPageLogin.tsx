import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useApp } from '../context/AppContext';

const LoginWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 40px 24px;
`;

const LoginCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-family: ${({ theme }) => theme.fonts.jua};
      font-size: 24px;
      color: #00223d;
      font-weight: 400;
      margin: 0;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  label {
    font-size: 13px;
    font-weight: 700;
    color: #00223d;
    margin-bottom: -8px;
  }

  input {
    width: 100%;
    height: 52px;
    border-radius: 14px;
    border: 1.5px solid #c8d3db;
    padding: 0 16px;
    font-size: 14px;
    color: #10202b;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${({ theme }) => theme.colors.cyanDark};
    }

    &::placeholder {
      color: #9aacb8;
    }
  }

  .primary-btn {
    width: 100%;
    height: 52px;
    border-radius: 14px;
    background: #002b49;
    color: #ffffff;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s ease;
    border: none;

    &:hover {
      background: #0b4a72;
    }
  }

  .helper-links {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    margin-bottom: 24px;

    button {
      font-size: 12px;
      color: #64798a;
      text-decoration: underline;
      cursor: pointer;
      border: none;
      background: none;
      padding: 4px;

      &:hover {
        color: #10202b;
      }
    }
  }

  .divider-row {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    width: 100%;

    .line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .text {
      font-size: 11px;
      color: #9aacb8;
      padding: 0 12px;
      font-weight: 700;
    }
  }

  .sns-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
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

const FullPageLogin: React.FC = () => {
  const { loginWithGoogle, loginWithApple } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('이메일 주소를 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        if (!password) {
          alert('비밀번호를 입력해 주세요.');
          setLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'signup') {
        if (!name) {
          alert('이름을 입력해 주세요.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          alert('비밀번호는 최소 6자 이상이어야 합니다.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        alert('회원가입이 완료되었습니다!');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        alert('비밀번호 재설정 메일이 전송되었습니다. 이메일을 확인해 주세요.');
        setMode('login');
      }
    } catch (error: any) {
      console.error(error);
      let errMsg = '오류가 발생했습니다. 다시 시도해 주세요.';
      if (error.code === 'auth/user-not-found') {
        errMsg = '존재하지 않는 회원 계정입니다.';
      } else if (error.code === 'auth/wrong-password') {
        errMsg = '비밀번호가 일치하지 않습니다.';
      } else if (error.code === 'auth/email-already-in-use') {
        errMsg = '이미 가입된 이메일 주소입니다.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = '유효하지 않은 이메일 형식입니다.';
      }
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <div className="card-header">
          <h2>
            {mode === 'login' && '로그인'}
            {mode === 'signup' && '회원가입'}
            {mode === 'reset' && '비밀번호 찾기'}
          </h2>
        </div>

        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            {mode === 'signup' && (
              <>
                <label htmlFor="name-input">이름</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="이름 입력"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </>
            )}

            <label htmlFor="email-input">이메일 주소</label>
            <input
              id="email-input"
              type="email"
              placeholder="example@arena.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            {mode !== 'reset' && (
              <>
                <label htmlFor="pw-input">비밀번호</label>
                <input
                  id="pw-input"
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </>
            )}
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? '처리 중...' : (
              <>
                {mode === 'login' && '이메일 로그인'}
                {mode === 'signup' && '이메일 회원가입'}
                {mode === 'reset' && '비밀번호 찾기 메일 발송'}
              </>
            )}
          </button>
        </form>

        <div className="helper-links">
          {mode === 'login' ? (
            <>
              <button type="button" onClick={() => setMode('reset')}>비밀번호 찾기</button>
              <button type="button" onClick={() => setMode('signup')}>이메일 회원가입</button>
            </>
          ) : (
            <button type="button" style={{ margin: '0 auto' }} onClick={() => setMode('login')}>
              로그인 화면으로 돌아가기
            </button>
          )}
        </div>

        <div className="divider-row">
          <div className="line" />
          <div className="text">또는 SNS 계정으로 로그인</div>
          <div className="line" />
        </div>

        <div className="sns-group">
          {/* Apple Login */}
          <button className="apple-login-btn" onClick={loginWithApple} disabled={loading}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple 계정으로 로그인
          </button>

          {/* Google Login */}
          <button className="google-login-btn" onClick={loginWithGoogle} disabled={loading}>
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
        </div>
      </LoginCard>
    </LoginWrapper>
  );
};

export default FullPageLogin;
