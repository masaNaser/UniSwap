import React from "react";

/**
 * وظيفة لتحويل الروابط داخل النص إلى عناصر <a> قابلة للنقر
 */
export const renderContentWithLinks = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith("www.") ? `https://${part}` : part;
      return (
        <a
          key={index}
          href={href}
          // target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: "#3b82f6", 
            textDecoration: "underline",
            wordBreak: "break-all",
            cursor: "pointer" // لضمان ظهور اليد عند التأشير
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};