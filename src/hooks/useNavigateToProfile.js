// hooks/useNavigateToProfile.js
import { useNavigate } from 'react-router-dom';

/**
 * Custom Hook للانتقال لصفحة البروفايل
 * يتعامل تلقائياً مع:
 * - البروفايل الشخصي: يروح على /app/profile
 * - بروفايل شخص تاني: يروح على /app/profile/:userId
 */
export const useNavigateToProfile = () => {
  const navigate = useNavigate();

  const navigateToProfile = (userId) => {
    // التحقق من وجود userId
  if (!userId) {
      console.log(" userId is missing!");
      return;
    }
    const currentUserId = localStorage.getItem("userId");
    
    // إذا البروفايل تبعي، روح على /app/profile بدون userId
if (String(userId) === String(currentUserId)) {
      navigate('/app/profile');
    } else {
      // إذا بروفايل شخص تاني، مرر الـ userId
      navigate(`/app/profile/${userId}`);
    }
  };

  return navigateToProfile;
};