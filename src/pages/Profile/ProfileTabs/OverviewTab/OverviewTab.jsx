// src/pages/Profile/tabs/OverviewTab.jsx


import React from "react";
import { Box, Typography, Chip, Stack, Card, CardContent } from "@mui/material";

// ====== Icons لكل تصنيف ======
import CodeIcon from "@mui/icons-material/Code";              // برمجة
import PaletteIcon from "@mui/icons-material/Palette";        // تصميم
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"; // بزنس
import ChatIcon from "@mui/icons-material/Chat";              // مهارات شخصية (Soft)
import ExtensionIcon from "@mui/icons-material/Extension";    // أخرى (غير مصنّفة)

import { useProfile } from "../../../../Context/ProfileContext";
import SkillsSection from "./SkillsSection";
import ServicesSection from "./ServicesSection";

export default function OverviewTab() {
  // const { userData } = useProfile();

  // // 🧠 دالة لتصنيف المهارات بناءً على كلمات مفتاحية (Front-end logic)
  // const categorizeSkills = () => {
  //   if (!userData?.skills || userData.skills.length === 0) {
  //     return {};
  //   }

  //   // 🔹 كلمات مفتاحية لكل تصنيف
  //   const programmingKeywords = [
  //     "react", "next", "node", "javascript", "typescript", "python",
  //     "java", "c++", "c#", "sql", "mongodb", "database", "backend",
  //     "frontend", "fullstack", "api", "express", "django", "flask"
  //   ];

  //   const designKeywords = [
  //     "ui", "ux", "figma", "photoshop", "illustrator", "xd", "adobe",
  //     "sketch", "canva", "prototype", "wireframe"
  //   ];

  //   const businessKeywords = [
  //     "management", "leadership", "project", "agile", "scrum", "strategy",
  //     "marketing", "communication", "planning", "negotiation"
  //   ];

  //   const softKeywords = [
  //     "english", "communication", "teamwork", "creativity", "problem solving",
  //     "time management", "adaptability", "leadership", "critical thinking"
  //   ];

  //   // 🔸 إنشاء المجموعات لكل تصنيف
  //   const grouped = {
  //     PROGRAMMING: [],
  //     DESIGN: [],
  //     BUSINESS: [],
  //     SOFT: [],
  //     OTHERS: [],
  //   };

  //   // 🔍 لكل مهارة، نقرر التصنيف
  //   userData.skills.forEach((skill) => {
  //     // تحويل للحروف الصغيرة
  //     const skillLower = skill.toLowerCase();
  //     // إزالة الفراغات، الشرطات، النقاط فقط (ما نحذف #)
  //     const normalized = skillLower.replace(/[\s\.\-]/g, "");

  //     // 🏷️ التصنيف حسب الكلمات المفتاحية
  //     if (programmingKeywords.some((k) => normalized.includes(k))) {
  //       grouped.PROGRAMMING.push(skill); // نستخدم الاسم الأصلي للعرض
  //     } else if (designKeywords.some((k) => normalized.includes(k))) {
  //       grouped.DESIGN.push(skill);
  //     } else if (businessKeywords.some((k) => normalized.includes(k))) {
  //       grouped.BUSINESS.push(skill);
  //     } else if (softKeywords.some((k) => normalized.includes(k))) {
  //       grouped.SOFT.push(skill);
  //     } else {
  //       grouped.OTHERS.push(skill);
  //     }
  //   });

  //   return grouped;
  // };

  // const categorizedSkills = categorizeSkills();

  // // 🎨 أيقونات وعناوين لكل تصنيف
  // const categoryConfig = {
  //   PROGRAMMING: { icon: <CodeIcon sx={{ fontSize: 18 }} />, label: "Programming" },
  //   DESIGN: { icon: <PaletteIcon sx={{ fontSize: 18 }} />, label: "Design" },
  //   BUSINESS: { icon: <BusinessCenterIcon sx={{ fontSize: 18 }} />, label: "Business" },
  //   SOFT: { icon: <ChatIcon sx={{ fontSize: 18 }} />, label: "Soft Skills" },
  //   OTHERS: { icon: <ExtensionIcon sx={{ fontSize: 18 }} />, label: "Others" },
  // };

  return (
    // <Box className="OverviewTab" sx={{ mb: 4 }}>
    //   <Card
    //     sx={{
    //       // background: "rgba(241, 245, 249, 1)",
    //       borderRadius: "12px",
    //       border: "1px solid rgba(226, 232, 240, 1)",
    //       boxShadow: "none",
    //       maxWidth: "700px",
    //     }}
    //   >
    //     <CardContent sx={{ p: 2.5 }}>
    //       {/* 🔹 العنوان الرئيسي للكارد */}
    //       <Stack direction="row" spacing={1} alignItems="center" mb={2}>
    //         <CodeIcon color="primary" />
    //         <Typography
    //           sx={{
    //             fontWeight: 400,
    //             fontSize: "16px",
    //             color: "rgba(15, 23, 42, 1)",
    //           }}
    //         >
    //           Skills & Expertise
    //         </Typography>
    //       </Stack>

    //       {/* 🔸 عرض المهارات حسب التصنيف */}
    //       {Object.entries(categorizedSkills).map(([category, skills]) =>
    //         skills.length > 0 ? (
    //           <Box key={category} mb={2.5}>
    //             {/* 🏷️ عنوان التصنيف */}
    //             <Stack direction="row" spacing={0.5} alignItems="center" mb={1.5}>
    //               {/* {categoryConfig[category]?.icon} */}
    //               <Typography
    //                 sx={{
    //                   fontWeight: 600,
    //                   fontSize: "13px",
    //                   color: "rgba(71, 85, 105, 1)",
    //                   textTransform: "uppercase",
    //                   letterSpacing: "0.5px",
    //                 }}
    //               >
    //                 {categoryConfig[category]?.label}
    //               </Typography>
    //             </Stack>

    //             {/*  عرض كل مهارة باستخدام الـ Chip */}
    //             <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
    //               {skills.map((skill, index) => (
    //                 <Chip
    //                   key={index}
    //                   label={skill} // ← الاسم الأصلي كما كتبه المستخدم
    //                   size="small"
    //                   // icon={categoryConfig[category]?.icon}
    //                   sx={{
    //                     backgroundColor: "rgba(248, 250, 252, 1)",
    //                     color: "rgba(15, 23, 42, 1)",
    //                     fontWeight: 500,
    //                     fontSize: "15px",
    //                     padding: "13px",
    //                     border: "1px solid rgba(226, 232, 240, 1)",
    //                     transition: "all 0.2s",
    //                     "&:hover": {
    //                       backgroundColor: "rgba(59, 130, 246, 0.1)",
    //                       borderColor: "rgba(59, 130, 246, 0.5)",
    //                       transform: "translateY(-2px)",
    //                     },
    //                   }}
    //                 />
    //               ))}
    //             </Box>
    //           </Box>
    //         ) : null
    //       )}

    //       {/* ⚠️ رسالة في حال ما في أي Skills */}
    //       {Object.values(categorizedSkills).every((arr) => arr.length === 0) && (
    //         <Typography
    //           sx={{
    //             color: "rgba(100, 116, 139, 1)",
    //             fontSize: "13px",
    //             textAlign: "center",
    //             py: 2,
    //           }}
    //         >
    //           No skills added yet
    //         </Typography>
    //       )}
    //     </CardContent>
    //   </Card>
    // </Box>
     <Box sx={{display: 'flex', flexDirection: 'row', gap: 4, mb:4, flexWrap: 'wrap', justifyContent: 'space-between'}}>
     <SkillsSection/>
     <ServicesSection/>
    </Box>
  );
}
