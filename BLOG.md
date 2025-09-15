# Blog System Documentation

This project now supports Jekyll-style markdown blog posts with front matter.

## Adding a New Blog Post

1. Create a new `.md` file in `src/blog/posts/`
2. Add Jekyll-style front matter at the top
3. Write your content in markdown
4. Build the project to generate the blog data

### Example Blog Post

Create `src/blog/posts/my-new-post.md`:

```markdown
---
title: "My Amazing Blog Post"
date: "2024-01-15"
author: "Your Name"
tags: ["technology", "web", "react"]
excerpt: "A brief description of your post that appears in the blog listing."
image: "https://example.com/featured-image.jpg"
published: true
slug: "my-amazing-post"
---

# My Amazing Blog Post

This is the content of your blog post written in **markdown**.

## Features

- Support for all standard markdown features
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- Lists and more!

```javascript
const example = () => {
  console.log("Code highlighting works!");
};
```

Your post will be automatically available at `/blog/my-amazing-post`.
```

## Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | The title of your blog post |
| `date` | ✅ | Publication date (YYYY-MM-DD format) |
| `author` | ❌ | Author name |
| `tags` | ❌ | Array of tags |
| `excerpt` | ❌ | Brief description shown in listings |
| `image` | ❌ | Featured image URL |
| `published` | ❌ | Set to `false` to hide the post (default: `true`) |
| `slug` | ❌ | Custom URL slug (defaults to filename) |

## Build Process

The blog system works by:

1. **Build time**: `scripts/generate-blog-data.ts` scans `src/blog/posts/` for `.md` files
2. **Parsing**: Each markdown file is parsed for front matter and content
3. **Processing**: Markdown content is converted to HTML using `marked`
4. **Generation**: A JSON file with all blog data is created at `src/data/blog-posts.json`
5. **Runtime**: The React app loads blog data from the JSON file

## Development

When developing, run:
```bash
bun run dev
```

This will automatically generate blog data and start the development server with hot reloading.

## Production Build

For production builds:
```bash
bun run build
```

This ensures blog data is generated before building the application.

## File Structure

```
src/
├── blog/
│   └── posts/          # Your markdown blog posts go here
│       ├── sample.md
│       └── another.md
├── components/
│   └── MarkdownPost.tsx  # Component that renders markdown posts
├── routes/blog/
│   ├── Blog.tsx         # Blog listing page
│   └── BlogPost.tsx     # Dynamic blog post route
├── utils/
│   └── markdown.ts      # Utilities for loading blog data
└── data/
    └── blog-posts.json  # Generated at build time (don't edit manually)

scripts/
└── generate-blog-data.ts  # Build script that processes markdown files
```

## URL Structure

- `/blog` - Blog listing page showing all published posts
- `/blog/[slug]` - Individual blog post page
- Posts are sorted by date (newest first)
- Unpublished posts (`published: false`) are hidden from listings