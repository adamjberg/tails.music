#!/usr/bin/env bun
import matter from 'gray-matter';
import { marked } from 'marked';
import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

async function parseMarkdownFile(filePath: string): Promise<BlogPost> {
  try {
    const file = Bun.file(filePath);
    const fileContent = await file.text();
    
    const { data, content } = matter(fileContent);
    
    // Generate slug from filename if not provided in front matter
    const filename = filePath.split('/').pop()?.replace('.md', '') || '';
    const slug = data.slug || filename;
    
    const htmlContent = await marked(content);
    
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      author: data.author,
      tags: data.tags,
      excerpt: data.excerpt,
      image: data.image,
      published: data.published !== false, // Default to true
      content,
      htmlContent,
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    throw error;
  }
}

async function generateBlogData() {
  const postsDir = 'src/blog/posts';
  
  if (!existsSync(postsDir)) {
    console.log(`Posts directory ${postsDir} does not exist. Creating empty blog data.`);
    const blogData = {
      posts: [],
      metas: []
    };
    
    // Ensure src/data directory exists
    if (!existsSync('src/data')) {
      mkdirSync('src/data', { recursive: true });
    }
    
    writeFileSync('src/data/blog-posts.json', JSON.stringify(blogData, null, 2));
    return;
  }
  
  try {
    const files = readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    console.log(`Found ${files.length} markdown files in ${postsDir}`);
    
    const posts = await Promise.all(
      files.map(file => parseMarkdownFile(join(postsDir, file)))
    );
    
    // Filter published posts and sort by date (newest first)
    const publishedPosts = posts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const metas: BlogPostMeta[] = publishedPosts.map(({ content, htmlContent, ...meta }) => meta);
    
    const blogData = {
      posts: publishedPosts,
      metas
    };
    
    // Ensure src/data directory exists
    if (!existsSync('src/data')) {
      mkdirSync('src/data', { recursive: true });
    }
    
    writeFileSync('src/data/blog-posts.json', JSON.stringify(blogData, null, 2));
    
    console.log(`Generated blog data with ${publishedPosts.length} published posts`);
    publishedPosts.forEach(post => {
      console.log(`  - ${post.title} (${post.slug})`);
    });
    
  } catch (error) {
    console.error('Error generating blog data:', error);
    process.exit(1);
  }
}

// Run if called directly (not imported)
if (import.meta.main) {
  await generateBlogData();
}