import React from "react";

interface PostPreviewProps {
  title: string;
  imageUrl: string;
  imageAlt?: string;
  className?: string;
}

export function PostPreview({ title, imageUrl, imageAlt, className = "" }: PostPreviewProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="aspect-square w-full">
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default PostPreview;
