import { Container,Box } from '@mui/material'
import ProfileHeader from './ProfileHeader'
import React,{ useState} from "react";

export default function Profile() {
  const [selectedConv, setSelectedConv] = useState(null);

  return (
    <>
    <Box>
        <Container maxWidth="lg">
          <ProfileHeader onOpenChat={setSelectedConv}/>
        </Container>
    </Box>
    </>
  )
}













