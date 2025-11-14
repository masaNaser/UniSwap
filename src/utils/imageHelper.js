// // src/utils/imageHelper.js

// const BASE_URL = import.meta.env.VITE_API_URL || "https://uni.runasp.net";

// export const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `${BASE_URL}${path}`;
// };

// src/utils/imageHelper.js

const BASE_URL = import.meta.env.VITE_API_URL || "https://uni.runasp.net";

export const getImageUrl = (path, fallbackName = "User") => {
  // إذا ما في صورة (null)، رجّع صورة افتراضية بأول حرفين من الاسم
  if (!path) {
    // أخذ أول حرفين من الاسم
    const initials = fallbackName
      .split(' ')
      .slice(0, 2)  // أول كلمتين
      .map(word => word[0])  // أول حرف من كل كلمة
      .join('')
      .toUpperCase();
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4A90E2&color=fff&size=200&bold=true&length=2`;
  }
  
  // إذا في صورة وهي full URL
  if (!path.startsWith("/")) path = "/" + path;
  
  // إذا في صورة وهي relative path
  return `${BASE_URL}${path}`;
};