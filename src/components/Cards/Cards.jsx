import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function SelectActionCard({ title, value, icon }) {
return (
<Card sx={{
width: 450, 
borderRadius: '12px',
boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
 transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          
        }
}}>
<CardContent sx={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: (theme) => theme.spacing(2), 
}}>
<Box>
<Typography variant="body2" color="text.secondary">
{title}
</Typography>
<Typography variant="h4" component="div">
{value}
</Typography>
</Box>
<Box sx={{
backgroundColor: '#f0f2f5',
borderRadius: '8px',
padding: (theme) => theme.spacing(1), 
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
}}>
{icon}
</Box>
</CardContent>
</Card>
);
}

export default SelectActionCard;