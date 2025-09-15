// Import the generated blog data
import blogData from '../data/blog-posts.json';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  published?: boolean;
  content: string;
  htmlContent: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  published?: boolean;
}

export function getAllBlogPosts(): BlogPost[] {
  return blogData.posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return blogData.posts.find(post => post.slug === slug) || null;
}

export function getBlogPostMetas(): BlogPostMeta[] {
  return blogData.metas;
}