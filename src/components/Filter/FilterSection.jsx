import * as React from "react";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTheme } from "@mui/material/styles";

export default function FilterSection({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  items = [],
}) {

  const theme = useTheme(); // 🔥 ضيفي هاد السطر


  const [anchorElements, setAnchorElements] = React.useState({});

  const handleMenuClick = React.useCallback((index, event) => {
    setAnchorElements((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }));
  }, []);

  const handleMenuClose = React.useCallback((index) => {
    setAnchorElements((prev) => ({
      ...prev,
      [index]: null,
    }));
  }, []);

  const handleMenuItemClick = React.useCallback(
    (index, value, onSelect) => {
      if (onSelect) onSelect(value);
      handleMenuClose(index);
    },
    [handleMenuClose]
  );

  return (
    <Box
      sx={{
        // backgroundColor: "#fff",
        backgroundColor: theme.palette.mode === 'dark' ? '#474646ff' : '#fff',
        borderRadius: "8px",
        border: "1px solid #E2E8F0",
        p: "16px 20px",
        mb: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        variant="outlined"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
        size="small"
        sx={{
          flex: 1,
          minWidth: "300px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            // backgroundColor: "#FAFBFC",
            backgroundColor: theme.palette.mode === 'dark' ? '#474646ff' : '#FAFBFC',
            "& fieldset": { borderColor: "#E2E8F0" },
            "&:hover fieldset": { borderColor: "#CBD5E1" },
            "&.Mui-focused fieldset": { borderColor: "#94A3B8" },
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px 12px",
            fontSize: "14px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#94A3B8", fontSize: "18px" }} />
            </InputAdornment>
          ),
        }}
      />

      {items.map((item, index) => {
        if (item.type === "menu") {
          return (
            <React.Fragment key={`menu-${index}`}>
              <Button
                onClick={(e) => handleMenuClick(index, e)}
                sx={{
                  borderRadius: "6px",
                  textTransform: "none",
                  // color: "#334155", 
                 // backgroundColor: "#FAFBFC",
                  color: theme.palette.mode === 'dark' ? '#fff' : '#334155',
                  backgroundColor: theme.palette.mode === 'dark' ? '#474646ff' : '#FAFBFC',
                  border: "1px solid #E2E8F0",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  minWidth: "fit-content",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  "&:hover": {
                  backgroundColor: theme.palette.mode === 'dark' ? '#a19f9fff' : '#F1F5F9',
                    borderColor: "#CBD5E1",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  },
                }}
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />}
              >
                {item.label}
              </Button>
              <Menu
                anchorEl={anchorElements[index]}
                open={Boolean(anchorElements[index])}
                onClose={() => handleMenuClose(index)}
                disableScrollLock={true}
                PaperProps={{
                  sx: {
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    mt: 1,
                  },
                }}
              >
                {item.items?.map((menuItem, itemIndex) => (
                  <MenuItem
                    key={itemIndex}
                    onClick={() =>
                      handleMenuItemClick(index, menuItem.value, item.onSelect)
                    }
                  >
                    {menuItem.label}
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          );
        } else if (item.type === "button") {
          return (
            <Button
              key={`button-${index}`}
              onClick={item.onClick}
              variant={item.variant || "outlined"}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                color: item.color || "#334155",
                color: theme.palette.mode === 'dark' ? '#fff' : '#334155',
                  backgroundColor: theme.palette.mode === 'dark' ? '#474646ff' : '#FAFBFC',
                // backgroundColor: item.backgroundColor || "#FAFBFC",
                border: item.border || "1px solid #E2E8F0",
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: "500",
                minWidth: "fit-content",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                "&:hover": {
                  backgroundColor: theme.palette.mode === 'dark' ? '#a19f9fff' : '#F1F5F9',
                  borderColor: item.borderHover || "#CBD5E1",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                },
              }}
            >
              {item.label}
            </Button>
          );
        }
      })}
    </Box>
  );
}