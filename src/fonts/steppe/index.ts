import localFont from 'next/font/local';
import { Golos_Text } from 'next/font/google';

export const steppeFont = localFont({
  src: [
    {
      path: 'Steppe-Light.woff2',
      weight: '200',
      style: 'normal'
    },
    {
      path: 'Steppe-Book.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: 'Steppe-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: 'Steppe-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: 'Steppe-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: 'Steppe-Bold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: 'Steppe-ExtraBold.woff2',
      weight: '800',
      style: 'normal'
    },
    {
      path: 'Steppe-Black.woff2',
      weight: '900',
      style: 'normal'
    }
  ],
  preload: true,
  variable: '--font-steppe',
  display: 'swap'
});

export const golosTextFont = Golos_Text({
  weight: '400',
  display: 'swap',
  subsets: ['cyrillic'],
  variable: '--font-golos-text'
});
