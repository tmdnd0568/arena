import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../lib/firebase';
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
  // Firebase Auth states & methods
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [language, setLanguage] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('language');
    return (saved as LanguageType) || 'ko';
  });

  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('likedProducts');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartList, setCartList] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartList');
    if (saved) return JSON.parse(saved);
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount === '0') return [];
    return DEFAULT_CART;
  });

  // Firebase Auth 상태 관리
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Google Login 구동
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Apple Login 구동
  const loginWithApple = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, appleProvider);
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      alert('애플 로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Logout 구동
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.ko;
    return langDict[key] || translations.ko[key] || '';
  };

  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  useEffect(() => {
    localStorage.setItem('cartList', JSON.stringify(cartList));
    localStorage.setItem('cartCount', String(cartList.length));
    window.dispatchEvent(new Event('storage'));
  }, [cartList]);

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (newItem: Omit<CartItem, 'qty' | 'checked'>) => {
    setCartList((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...newItem, qty: 1, checked: true }];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartList((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const toggleCartCheck = (id: string) => {
    setCartList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeCartItem = (id: string) => {
    setCartList((prev) => prev.filter((item) => item.id !== id));
  };

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
        user,
        loading,
        loginWithGoogle,
        loginWithApple,
        logout,
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
