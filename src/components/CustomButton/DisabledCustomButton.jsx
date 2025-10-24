import { Button, CircularProgress } from "@mui/material";

export default function CustomButton({
  children,
  type = "button",
  loading = false,
  sx,
  ...props
}) {


  return (
    <Button disabled
      children
      type={type}
      {...props}
      sx={{
        borderRadius: 8,
        textTransform: "none",
        transition: "0.2s",
        fontSize: 16,
        opacity: loading ? 0.7 : 0.5,
        background: "linear-gradient(to right, #00C8FF, #8B5FF6);",
        color: "white",
        border: "none",
        padding: "10px 20px",
        ...sx, // أي تعديل إضافي من برّا
      }}
    >
      {loading ? <CircularProgress color="inherit" /> : children}
    </Button>
  );
}
