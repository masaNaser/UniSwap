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
  image,
  cardWidth = "368px", 
  cardHeight = "270px",
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        height: cardHeight,
        width: cardWidth,
        maxWidth: "100%",
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
          p: 2, // Remove default padding since Card already has padding
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
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
                width: 30,
                height: 30,
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
            <Box sx={{ color: "primary.main", flexShrink: 0 }}>{icon}</Box>
          )}

          {image && (
            <Box sx={{ color: "primary.main", display: 'none', flexShrink: 0 }}>{icon}</Box>
          )}

          <Typography
            variant="h6"
            onClick={() => setShowFullTitle(!showFullTitle)}
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              cursor: "pointer",
              transition: "color 0.2s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2, // Always limit to 2 lines
              WebkitBoxOrient: "vertical",
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
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4, // Show max 4 lines
            WebkitBoxOrient: "vertical",
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