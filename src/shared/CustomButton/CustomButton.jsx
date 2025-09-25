import { Button, CircularProgress } from "@mui/material";

export default function CustomButton({
  children,
  type = "button",
  loading = false,
  sx,
  ...props
}) {
  return (
    <Button
      children
      type={type}
      {...props}
      disabled={loading || props.disabled} // 👈 تعطيل الزر وقت اللودنج
      sx={{
        borderRadius: 8,
        textTransform: "none",
        transition: "0.2s",
        fontSize: 18,
        opacity: loading ? 0.7 : 0.5,
        background: "linear-gradient(to right, #00C8FF, #8B5FF6);",
        color: "white",
        border: "none",
        "&:hover": {
          background: "white",
          color: "#3b82f6",
          border: "1px solid #3b82f6",
        },
        ...sx, // أي تعديل إضافي من برّا
      }}
    >
      {loading ? <CircularProgress color="inherit" /> : children}
    </Button>
  );
}
