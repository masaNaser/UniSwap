import React from "react";

/**
 * وظيفة لتحويل الروابط داخل النص إلى عناصر <a> قابلة للنقر
 */
export const renderContentWithLinks = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
    /*لو الرابط بدأ بـ www. → يضيف https:// تلقائيًا
لو بدأ بـ http:// أو https:// → يستخدمه كما هو
*/
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
            cursor: "pointer" 
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};