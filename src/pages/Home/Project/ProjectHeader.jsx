import React from 'react'
import { Box, Typography} from "@mui/material";
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
export default function ProjectHeader(props) {
  return (
      <Box
  sx={{
    mt: 5,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    p: 4,
    px:8,
    bgcolor: "#58b3ce21",
    position: "relative",
    overflow: "hidden", // مهم حتى لا يخرج الشكل عن الصندوق
    borderRadius: 3,
  }}
>
  {/* نصف دائرة يمين علوي */}
  <Box
    sx={{
      width: 60,
      height: 60,
      bgcolor: "#0c88ec4a",
      borderBottomLeftRadius: "100%", // تجعلها ربع دائرة
      position: "absolute",
      top: 0,
      right: 0,
    }}
  />

  {/* نصف دائرة يسار سفلي */}
  <Box
    sx={{
      width: 60,
      height: 60,
      bgcolor: "#0c88ec4a",
      borderTopRightRadius: "100%", // تجعلها ربع دائرة
      position: "absolute",
      bottom: 0,
      left: 0,
    }}
  />
    <Box sx={{ display: "flex", alignItems: "center", gap:1 }}>
    <VolunteerActivismOutlinedIcon sx={{ color: "#0566b3"}} />
    <Box>
  <Typography variant="span" fontWeight="bold">
    {props.title}
  </Typography>
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "#0566b3",
      }}
    />
    <Typography variant="span" sx={{ fontWeight: "bold", color: "#0566b3" }}>
      {props.status}
    </Typography>
  </Box>
</Box>
  </Box>
  <Typography variant="span" color="#475569" sx={{ mt: 1,ml: "27px" }}>
    {props.description}
  </Typography>
</Box>
  )
}
