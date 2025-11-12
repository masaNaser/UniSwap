import React from 'react'
import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import Logo from "../../assets/images/Logo.png";
export default function Footer() {
  return (
    <>
      {/* Footer */}
      <Box
        sx={{
          background: "rgba(0, 75, 173, 0.84)",
          color: "white",
          py: 3,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src={Logo}
                alt="UniSwap logo"
                style={{ height: "36px", width: "36px" }}
              />
              <Typography sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.84)" }}>
                UniSwap
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, color: "rgba(255, 255, 255, 0.84)" }}
            >
              Empowering students to learn, share, and grow together.
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.84)",
              }}
            >
              © {new Date().getFullYear()} UniSwap. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>)
}