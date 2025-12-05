import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") => {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light Mode Colors
            background: {
              default: "#f5f6fa",
              paper: "#fff",
            },
            text: {
              primary: "#000",
              secondary: "#666",
            },
            primary: {
              main: "#1976d2",
              light: "#42a5f5",
              dark: "#1565c0",
            },
            secondary: {
              main: "#9c27b0",
              light: "#ba68c8",
              dark: "#7b1fa2",
            },
          }
        : {
            // Dark Mode Colors
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "#fff",
              secondary: "#aaa",
            },
            primary: {
              main: "#90caf9",
              light: "#e3f2fd",
              dark: "#42a5f5",
            },
            secondary: {
              main: "#ce93d8",
              light: "#f3e5f5",
              dark: "#ab47bc",
            },
          }),
    },
    // typography: {
    //   fontFamily: [
    //     '-apple-system',
    //     'BlinkMacSystemFont',
    //     '"Segoe UI"',
    //     'Roboto',
    //     '"Helvetica Neue"',
    //     'Arial',
    //     'sans-serif',
    //   ].join(','),
    // },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderBottom: mode === "light" ? "1px solid #e0e0e0" : "1px solid #333",
          },
        },
      },
      // MuiPaper: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: 12,
      //     },
      //   },
      // },
      // MuiButton: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: 8,
      //       textTransform: "none",
      //       fontWeight: 600,
      //     },
      //   },
      // },
      // MuiCard: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: 12,
      //       boxShadow: mode === "light"
      //         ? "0 2px 8px rgba(0,0,0,0.1)"
      //         : "0 2px 8px rgba(0,0,0,0.3)",
      //     },
      //   },
      // },
      // MuiTextField: {
      //   styleOverrides: {
      //     root: {
      //       "& .MuiOutlinedInput-root": {
      //         borderRadius: 8,
      //       },
      //     },
      //   },
      // },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.3s ease, color 0.3s ease",
            scrollbarWidth: "thin",
            scrollbarColor: mode === "dark" ? "#666 #1e1e1e" : "#ccc #f5f6fa",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#1e1e1e" : "#f5f6fa",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#666" : "#ccc",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: mode === "dark" ? "#888" : "#aaa",
            },
          },
        },
      },
    },
  });
};