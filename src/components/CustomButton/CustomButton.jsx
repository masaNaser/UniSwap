import { Button, CircularProgress } from "@mui/material";

export default function CustomButton({
  children,
  type = "button",
  loading = false,
  disabled = false,  // ✅ استقبلها كـ prop
  sx,
  ...props
}) {
  return (
    <Button
      type={type}
      disabled={disabled || loading}  // ✅ استخدمها هون
      {...props}
      sx={{
        borderRadius: 8,
        textTransform: "none",
        transition: "0.2s",
        fontSize: 16,
        background: 'linear-gradient(to right, #00C8FF, #8B5FF6)',
        color: "white",
        border: "none",
        padding: "10px 20px",
        height: "max-content",
        maxHeight: "max-content",
        "&:hover": {
          background: "white",
          color: "#3b82f6",
          border: "1px solid #3b82f6",
        },
        ...sx,
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
}