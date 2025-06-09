'use client';

import { useState, useEffect } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Flex, Text, HStack } from '@chakra-ui/react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  
  // Sayfa yüklendiğinde isClient'i true yap
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        _hover={{ bg: 'gray.100' }}
      >
        {locale === 'tr' ? 'Türkçe' : 'English'}
      </MenuButton>
      <MenuList zIndex={1000}>
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