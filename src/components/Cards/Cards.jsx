import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function SelectActionCard({ title, value, icon }) {
return (
<<<<<<< HEAD
<Card
  sx={{
    width: '100%',
    maxWidth: 400,
    borderRadius: '12px',
    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': { transform: 'scale(1.02)' },
    margin: '0 auto',
  }}
>

=======
<Card sx={{
width: 450, 
borderRadius: '12px',
boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
 transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          
        }
}}>
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
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
<<<<<<< HEAD
// justifyContent: 'center',
=======
justifyContent: 'center',
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
}}>
{icon}
</Box>
</CardContent>
</Card>
);
}

export default SelectActionCard;