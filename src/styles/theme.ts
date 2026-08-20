export const theme = {
  colors: {
    cyan: '#00C2FF',
    cyanDark: '#009FDB',
    navy: '#002B49',
    navyLight: '#0B4A72',
    white: '#FFFFFF',
    bgSoft: '#EAF3F8',
    bgSoft2: '#F5FAFC',
    border: '#E1EAF0',
    text: '#10202B',
    textMuted: '#64798A',
    textFaint: '#9AACB8',
  },
  radii: {
    pill: '999px',
    sm: '10px',
    md: '18px',
    lg: '28px',
  },
  shadows: {
    card: '0 4px 16px rgba(0, 43, 73, 0.08)',
    header: '0 2px 8px rgba(0, 43, 73, 0.05)',
  },
  fonts: {
    body: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
    jua: "'Jua', sans-serif",
  },
  media: {
    desktop: '(min-width: 481px)',
    mobile: '(max-width: 480px)',
    tablet: '(min-width: 768px)',
    largeDesktop: '(min-width: 1024px)',
    smallMobile: '(max-width: 360px)',
  },
};

export type ThemeType = typeof theme;
