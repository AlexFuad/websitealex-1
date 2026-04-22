import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog - Alex Fuad',
  description: 'Read my latest articles about web development, technology trends, and programming insights.',
  keywords: ['blog', 'articles', 'web development', 'technology', 'programming', 'tutorials'],
}

export default function BlogPage() {
  return <BlogClient />
}
