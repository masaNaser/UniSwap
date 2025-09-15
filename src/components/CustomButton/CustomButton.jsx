// import { Button } from "@mui/material";

// export default function CustomButton({ children, ...props }) {
//   return (
//     <Button
//       {...props}
//       sx={{
//         ...props.sx,  // أولاً تمرير أي sx خارجي
//         borderRadius: 8,
//         background: 'linear-gradient(to right,#00C8FF,#8B5FF6)',
//         color: 'white',
//         transition: '0.2s',
//         '&:hover': {
//           background: 'white',
//           color: '#3b82f6',
//           border: '1px solid #3b82f6',
//         },
//       }}
//     >
//       {children}
//     </Button>
//   );
// }

import { Button } from "@mui/material";

export default function CustomButton({ children, type = "button", sx, ...props }) {
  return (
    <Button
      type={type}
      {...props}
      sx={{
        borderRadius: 8,
        textTransform: "none",
        transition: "0.2s",
        background: 'linear-gradient(to right,#00C8FF,#8B5FF6)',
        color: "white",
        border: "none",
        padding: "10px 20px",
        "&:hover": {
          background: "white",
          color: "#3b82f6",
          border: "1px solid #3b82f6",
        },
        ...sx, // أي تعديل إضافي من برّا
      }}
    >
      {children}
    </Button>
  );
}

