
import { RootLayout } from "@/components/layouts/rootLayout";
import type { Metadata } from "next";
import "./styles/global.scss";
import clsx from "clsx";
import { golosTextFont, steppeFont } from "@/fonts/steppe/index";
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
      <body className={clsx(golosTextFont.variable, steppeFont.variable)}>
        <RootLayout>
          {children}
        </RootLayout>
      </body>
    </html>
  );
}
