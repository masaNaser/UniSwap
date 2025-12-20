


import React from "react";
import { Box, Typography, Chip, Card, CardContent, Stack } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useProfile } from "../../../../Context/ProfileContext";
import { useTheme } from "@mui/material/styles";
export default function SkillsSection() {
  const { userData } = useProfile();
  const theme = useTheme();
  return (
    <Box className="OverviewTab" sx={{ mb: 4 }}>
      <Card
        sx={{
          borderRadius: "12px",
          border: "1px solid rgba(226, 232, 240, 1)",
          boxShadow: "none",
          maxWidth: "700px",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* العنوان */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <CodeIcon color="primary" />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                // color: "rgba(15, 23, 42, 1)",
                color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(15, 23, 42, 1)',
              }}
            >
              Skills & Expertise
            </Typography>
          </Stack>

          {/* عرض الـ Skills */}
          {userData?.skills && userData.skills.length > 0 ? (
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {userData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    // backgroundColor: "rgba(248, 250, 252, 1)",
                    backgroundColor: theme.palette.mode === 'dark' ? '#323232ff' : 'rgba(248, 250, 252, 1)',
                    color:theme.palette.mode === 'dark' ? '#fff' : 'rgba(15, 23, 42, 1)',
                    fontWeight: 500,
                    fontSize: "15px",
                    padding: "13px",
                    border: "1px solid rgba(226, 232, 240, 1)",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      borderColor: "rgba(59, 130, 246, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                color: "rgba(100, 116, 139, 1)",
                fontSize: "13px",
                textAlign: "center",
                py: 2,
              }}
            >
              No skills added yet
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
