'use client';

import { useState, useEffect } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Flex, Text } from '@chakra-ui/react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import trTranslations from '@/locales/tr.json';
import enTranslations from '@/locales/en.json';

// Çeviri verilerini önceden yükleyelim
const translationsData = {
  tr: trTranslations,
  en: enTranslations
};

// Tarayıcı tarafında çalıştığımızdan emin olalım
const isBrowser = typeof window !== 'undefined';

// Varsayılan dili belirleyelim
let currentLocale = 'en'; // Varsayılan olarak İngilizce

// Çeviri fonksiyonu
export function t(key: string): string {
  try {
    const keys = key.split('.');
    let value: any = translationsData[currentLocale];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<'tr' | 'en'>('en'); // Varsayılan olarak İngilizce
  const [isClient, setIsClient] = useState(false);
  
  // Sayfa yüklendiğinde localStorage'a dil bilgisini kaydedelim
  useEffect(() => {
    setIsClient(true);
    
    if (isBrowser) {
      // localStorage'dan kayıtlı dili alalım
      const savedLocale = localStorage.getItem('locale') as 'tr' | 'en' | null;
      if (savedLocale && (savedLocale === 'tr' || savedLocale === 'en')) {
        setLocale(savedLocale);
        currentLocale = savedLocale;
        document.documentElement.lang = savedLocale;
      } else {
        // Tarayıcı dilini kontrol edelim
        const browserLang = navigator.language.split('-')[0];
        const newLocale = browserLang === 'tr' ? 'tr' : 'en';
        setLocale(newLocale);
        currentLocale = newLocale;
        localStorage.setItem('locale', newLocale);
        document.documentElement.lang = newLocale;
      }
    }
  }, []);

  const changeLanguage = (newLocale: 'tr' | 'en') => {
    // Önce state'i güncelleyelim (UI için)
    setLocale(newLocale);
    
    // Sonra global değişkeni güncelleyelim (çeviriler için)
    currentLocale = newLocale;
    
    if (isBrowser) {
      // localStorage'a kaydedelim
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
      
      // Sayfayı yeniden yükleyelim (en güvenli yöntem)
      window.location.reload();
    }
  };

  // İstemci tarafında render edilene kadar boş bir içerik gösterelim
  if (!isClient) {
    return null;
  }

  return (
    <Menu>
      <MenuButton 
        as={Button} 
        size="sm" 
        variant="ghost" 
        rightIcon={<FaChevronDown />} 
        leftIcon={<FaGlobe />}
        color="gray.600"
      >
        {locale === 'tr' ? 'Türkçe' : 'English'}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => changeLanguage('tr')}>
          <Flex align="center">
            <Text fontWeight={locale === 'tr' ? 'bold' : 'normal'}>Türkçe</Text>
            {locale === 'tr' && <Text ml={2} color="blue.500">✓</Text>}
          </Flex>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>
          <Flex align="center">
            <Text fontWeight={locale === 'en' ? 'bold' : 'normal'}>English</Text>
            {locale === 'en' && <Text ml={2} color="blue.500">✓</Text>}
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}