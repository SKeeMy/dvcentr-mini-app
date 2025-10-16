'use client'
import { Container } from "@/components/container/container";
import { BannerSlide } from "@/components/pages/banner-slider/banner-slide/banner-slide";
import { BannerSlider } from "@/components/pages/banner-slider/banner-slider";
import { CatalogCategory } from "@/components/pages/catalog/catalog-category/catalog-category";
import { Section } from "@/components/section/section";
import { SearchInput } from "@/components/ui/search-input/search-input";

export default function Catalog() {
  return (
    <div>
      <BannerSlider />
      <Section name="Каталог">
        <div></div>
      </Section>
    </div>
  )
}