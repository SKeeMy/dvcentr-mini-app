'use client'
import { Container } from "@/components/container/container";
import { Section } from "@/components/section/section";
import { useEffect, useRef } from 'react';
import { init, viewport, backButton, isTMA, disableVerticalSwipes } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';
import { Product } from "@/components/pages/catalog/product/product";
import { IProductProps } from "../types";
import { CatalogItems } from "@/components/pages/catalog/catalog-items/catalog-items";

export default function Catalog() {
  const router = useRouter();
  const backHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    async function initializeCatalog() {
      try {
        if (await isTMA()) {
          init();

          await viewport.mount();
          viewport.expand();
          
          disableVerticalSwipes()

          backHandlerRef.current = () => {
            router.push('/');
          };

          backButton.show();
          backButton.onClick(backHandlerRef.current);
        }
      } catch (error) {
        console.error('Ошибка инициализации каталога:', error);
      }
    }

    initializeCatalog();

    return () => {
      if (backHandlerRef.current) {
        backButton.offClick(backHandlerRef.current);
      }
      backButton.hide();
    };
  }, [router]);


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