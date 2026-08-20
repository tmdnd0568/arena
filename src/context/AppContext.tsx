import React, { createContext, useContext, useState, useEffect } from 'react';

import { translations } from '../utils/i18n';
import type { LanguageType, TranslationKey } from '../utils/i18n';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  checked: boolean;
  color: string;
  image: string;
}

interface AppContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: TranslationKey) => string;
  likedProducts: string[];
  cartList: CartItem[];
  cartCount: number;
  toggleLike: (productId: string) => void;
  addToCart: (item: Omit<CartItem, 'qty' | 'checked'>) => void;
  updateCartQty: (id: string, qty: number) => void;
  toggleCartCheck: (id: string) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 초기 기본 장바구니 리스트 (피그마 시안 기준 3개)
const DEFAULT_CART: CartItem[] = [
  {
    id: 'cart-item-0',
    name: 'Cobra Ultra Swipe',
    price: 750000,
    qty: 1,
    checked: true,
    color: '옐로우 고퍼 / 블랙',
    image: 'images/goggles.png',
  },
  {
    id: 'cart-item-1',
    name: 'The One Mask',
    price: 380000,
    qty: 1,
    checked: true,
    color: '스모크 / 화이트',
    image: 'images/mask_one.png',
  },
  {
    id: 'cart-item-2',
    name: 'Cruiser Evo',
    price: 200000,
    qty: 1,
    checked: true,
    color: '블루 / 실버',
    image: 'images/cruiser_evo.png',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. 언어 설정 (language) 로컬 스토리지 연동
  const [language, setLanguage] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('language');
    return (saved as LanguageType) || 'ko';
  });

  // 1. 찜 목록 (likedProducts) 로컬 스토리지 연동
  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('likedProducts');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 장바구니 리스트 (cartList) 로컬 스토리지 연동
  const [cartList, setCartList] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartList');
    if (saved) return JSON.parse(saved);
    // 없을 경우 기존 로컬스토리지의 'cartCount'가 3개 이상이면 디폴트 세팅
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount === '0') return [];
    return DEFAULT_CART;
  });

  // 언어 설정 변경 시 로컬 스토리지 동기화
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // 번역 헬퍼 함수 정의
  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.ko;
    return langDict[key] || translations.ko[key] || '';
  };

  // 찜 목록 상태 변경 시 로컬 스토리지 동기화
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  // 장바구니 목록 상태 변경 시 로컬 스토리지 및 cartCount 동기화
  useEffect(() => {
    localStorage.setItem('cartList', JSON.stringify(cartList));
    localStorage.setItem('cartCount', String(cartList.length));
    
    // 다른 바닐라 페이지들과의 하이브리드 연동을 위한 커스텀 이벤트 발송
    window.dispatchEvent(new Event('storage'));
  }, [cartList]);

  // 찜 토글
  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // 장바구니 담기
  const addToCart = (newItem: Omit<CartItem, 'qty' | 'checked'>) => {
    setCartList((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        // 이미 존재하면 수량만 증가
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      // 새 아이템 추가
      return [...prev, { ...newItem, qty: 1, checked: true }];
    });
  };

  // 장바구니 수량 조정
  const updateCartQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartList((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  // 장바구니 체크 토글 (체크 해제 시 상품 삭제 인터랙션 유도)
  const toggleCartCheck = (id: string) => {
    setCartList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // 장바구니 상품 제거
  const removeCartItem = (id: string) => {
    setCartList((prev) => prev.filter((item) => item.id !== id));
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCartList([]);
  };

  const cartCount = cartList.length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        likedProducts,
        cartList,
        cartCount,
        toggleLike,
        addToCart,
        updateCartQty,
        toggleCartCheck,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
