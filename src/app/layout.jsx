import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
