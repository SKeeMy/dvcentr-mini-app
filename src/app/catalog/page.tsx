'use client'
import { Container } from "@/components/container/container";
import { Section } from "@/components/section/section";
import { useEffect, useRef } from 'react';
import { init, viewport, backButton, isTMA, swipeBehavior } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';
import { Product } from "@/components/pages/catalog/product/product";
import { IProductProps } from "../types";
import { CatalogItems } from "@/components/pages/catalog/catalog-items/catalog-items";
import { useAppBackButton } from "../hooks/useAppBackButton";

export default function Catalog() {
  const router = useRouter();

  const { showButton, hideButton, isVisible } = useAppBackButton(() => {
    console.log('Back button clicked, navigating to home');
    router.push('/');
  });

  useEffect(() => {
    async function initializeCatalog() {
      try {
        if (await isTMA()) {
          showButton();
          console.log('Back button shown, visible:', isVisible);
        }
      } catch (error) {
        console.error('Ошибка инициализации каталога:', error);
      }
    }

    initializeCatalog();

    return () => {
      hideButton();
    };
  }, [showButton, hideButton, isVisible]);



  const products: IProductProps[] = [
    {
      id: 1,
      title: 'Игрушка "Бетономешалка с добрым сердцем"',
      description: 'Игрушка мягкая "Бетономешалка с добрым сердцем"',
      image: '/images/catalog-toys.png',
      price: 4200,
    },
    {
      id: 2,
      title: 'Игрушка "Бетономешалка с добрым сердцем (голос)"',
      description: 'Игрушка мягкая "Бетономешалка с добрым сердцем" с голосовым модулем',
      image: '/images/catalog-toys.png',
      price: 6300,
    },
  ]


  return (

    <Section name={null}>
      <CatalogItems products={products} />
    </Section>
  );
}