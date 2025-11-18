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
import { catalog_products } from "../config/products";
import { useFooterStore } from "@/store/footer-strore";

export default function Catalog() {
  const router = useRouter();
  const { isOpen, closeFooter } = useFooterStore()
  // const { showButton, hideButton, isVisible } = useAppBackButton(() => {
  //   if (isOpen) {
  //     closeFooter()
  //   } else {
  //     router.push('/');

  //   }
  // });
  // useEffect(() => {
  //   async function initializeCatalog() {
  //     try {
  //       if (await isTMA()) {
  //         showButton();
  //       }
  //     } catch (error) {
  //       console.error('Ошибка инициализации каталога:', error);
  //     }
  //   }

  //   initializeCatalog();

  //   return () => {
  //     hideButton();
  //   };
  // }, [showButton, hideButton, isVisible]);






  return (

    <Section name={null}>
      <CatalogItems products={catalog_products} />
    </Section>
  );
}