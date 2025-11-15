
import { Box, Container } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import { useLocation } from "react-router-dom";

export default function TrackTasks() {
     const location = useLocation();
  const cardData = location.state; // البيانات المرسلة من الكارد
  return (
    <Container  maxWidth="lg">
    <Box>
        <Header cardData={cardData} />
    </Box>
    </Container>
  )
}
