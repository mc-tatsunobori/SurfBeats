import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css';
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";
import 'swiper/swiper-bundle.min.css';


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
