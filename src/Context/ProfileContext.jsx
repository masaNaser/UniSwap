

// بستخدمه في صفحة البروفايل بس (Profile.js)
// بيعرض بيانات اليوزر اللي عم تشوف بروفايله (ممكن يكون انت أو حد ثاني)
// بتتغير بياناته حسب الـ userId بالـ URL



import { createContext, useContext } from "react";

export const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);
