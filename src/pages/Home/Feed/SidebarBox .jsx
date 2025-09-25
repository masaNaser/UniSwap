import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";

export default function SidebarBox({ title, icon, items }) {
  return (
    <Box
      sx={{
        mb: 4,
        padding: 4,
        borderRadius: 3,
        boxShadow: "0 0 0 2px rgba(101, 103, 107, 0.08)",
      }}
      bgcolor="#FFF"
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Box>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.name || item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
