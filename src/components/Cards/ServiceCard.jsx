import { useState } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl } from "../../utils/imageHelper";
import { useTheme } from "@mui/material/styles";

const ServiceCard = ({
  icon,
  title,
  description,
  count,
  url,
  verticalHeader,
  adminMode,
  onEdit,
  onDelete,
  image
}) => {
  const theme = useTheme(); // 🔥 ضيفي هاد السطر

  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullTitle, setShowFullTitle] = useState(false); // ✅ لعرض العنوان الكامل
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        height: "100%",
        width: "368px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "12px",
        transition: "0.3s",
        position: "relative",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 3 },
      }}
    >
      {adminMode && (
        <IconButton
          onClick={handleMenuOpen}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 1,
            flexDirection: verticalHeader ? "column" : "row",
            alignItems: verticalHeader ? "flex-start" : "center",
          }}
        >
          {image ? (
            <Box
              component="img"
              src={getImageUrl(image)}
              alt={title}
              sx={{
                width: 48,
                height: 48,
                objectFit: "cover",
                borderRadius: 2,
                flexShrink: 0,
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
          ) : (
            <Box sx={{ color: "primary.main" }}>{icon}</Box>
          )}

          {image && (
            <Box sx={{ color: "primary.main", display: 'none' }}>{icon}</Box>
          )}

          <Typography
            variant="h6"
            onClick={() => setShowFullTitle(!showFullTitle)} //  يبدل بين مختصر وكامل
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              cursor: "pointer",
              transition: "color 0.2s",

              //  لو showFullTitle = false، اعرض سطرين بس
              ...(!showFullTitle && {
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              })
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            my: 1,
            minHeight: "60px",
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          {count && (
            <Box
              sx={{
                //  backgroundColor: "#F1F5F9",
                backgroundColor: theme.palette.mode === 'dark' ? '#474646ff' : '#F1F5F9',
                borderRadius: "12px",
                py: 0.5,
                px: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
              >
                {count}
              </Typography>
            </Box>
          )}

          {url && (
            <IconButton
              component={Link}
              to={url}
              size="small"
              sx={{
                color: "inherit",
                ml: "auto",
                transition: "0.2s",
                "&:hover": { transform: "translateX(3px)", color: "#6A67FE" },
              }}
            >
              <ArrowRightAltIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;