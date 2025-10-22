
import { RootLayout } from "@/components/layouts/rootLayout";
import type { Metadata } from "next";
import "./styles/global.scss";

import 'swiper/css';
import 'swiper/css/pagination';

export const metadata: Metadata = {
  title: "DVCentr Mini APP",
  description: "DVCentr Mini APP Telegram Bot",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 

  return (
    <html lang="ru">
        <RootLayout>
          {children}
        </RootLayout>
    </html>
  );
}
