import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard(props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
        p: 2,
        textAlign: "center",
        width: 178,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': { transform: 'scale(1.02)', boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" },
      }}
    >
      <CardContent>
        {/* الرقم */}
        <Typography variant="h5" fontWeight="bold" color={props.color}>
          {props.value}
        </Typography>

        {/* النص */}
        <Typography variant="body1" color="#64748B" sx={{ mb: 1, fontWeight: "bold" }}>
          {props.label}
        </Typography>

        {/* Progress Bar */}
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "#e0e0e0",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: `${props.progress}%`,
              height: "100%",
              bgcolor: props.color,
              transition: "width 0.3s ease-in-out",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}