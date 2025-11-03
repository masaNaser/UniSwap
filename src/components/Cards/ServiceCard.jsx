

import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const ServiceCard = ({ icon, title, description, count, url, verticalHeader }) => {
  return (
    <Card
      sx={{
        height: "100%",
        width: "368px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "12px",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 3 },
      }}
    >
      {/* المحتوى الرئيسي */}
      <CardContent
        sx={{
          flexGrow: 1, // ✅ يسمح للوصف يتمدد لكن يخلي الجزء السفلي ثابت
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* أيقونة + عنوان */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 1,
            flexDirection: verticalHeader ? "column" : "row",
            alignItems: verticalHeader ? "flex-start" : "center",
          }}
        >
          <Box sx={{ color: "primary.main" }}>{icon}</Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            {title}
          </Typography>
        </Box>

        {/* الوصف */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1, // ✅ يجعل الوصف يأخذ مساحة متغيرة بدون تحريك السهم
            my: 1,
            minHeight: "60px", // ✅ يضمن تساوي الارتفاع بين الكروت القصيرة والطويلة
          }}
        >
          {description}
        </Typography>

        {/* الجزء السفلي (عدد الخدمات + السهم) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto", // ✅ يثبت هذا الجزء بأسفل الكارد
          }}
        >
          {count && (
            <Box
              sx={{
                backgroundColor: "#F1F5F9",
                borderRadius: "12px",
                py: 0.5,
                px: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
              >
                {count}
              </Typography>
            </Box>
          )}

          {url && (
            <IconButton
              component={Link}
              to={url}
              size="small"
              sx={{
                color: "inherit",
                transition: "0.2s",
                "&:hover": { transform: "translateX(3px)", color: "#6A67FE" },
              }}
            >
              <ArrowRightAltIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
