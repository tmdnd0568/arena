import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* 폰트 import */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;800;900&family=Jua&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.text};
    background: #D9E8F0; /* 광폭 화면 여백 배경색 */
    -webkit-font-smoothing: antialiased;
  }

  img {
    display: block;
    max-width: 100%;
    object-fit: cover;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  ul {
    list-style: none;
  }

  svg {
    display: block;
    flex-shrink: 0;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.cyan};
    outline-offset: 2px;
  }
`;
