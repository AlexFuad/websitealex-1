import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Alex Fuad - Full Stack Developer',
  description: 'Professional portfolio showcasing my work as a full stack developer',
  keywords: ['full stack developer', 'web developer', 'portfolio', 'react', 'next.js', 'node.js'],
  author: 'Alex Fuad',
  openGraph: {
    title: 'Alex Fuad - Full Stack Developer',
    description: 'Professional portfolio showcasing my work as a full stack developer',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
