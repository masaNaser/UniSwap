import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Divider,
  Chip,
  CardMedia
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ProfilePic from '../../../assets/images/ProfilePic.jpg';
const PostCard = ({ post }) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        mb: 3,
      }}
    >
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={post.user.avatar} alt="User Avatar" />
             <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                  {post.category} • {post.time}
              </Typography>
            </Box>
          </Stack>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Stack>
           {/* User info */}
        {/* <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={ProfilePic} alt="User Avatar" />
          <Box ml={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              John Doe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.category}
            </Typography>
          </Box>
        </Box> */}

        {/* Content */}
        <Box mt={2}>
          <Typography variant="body1">{post.content}</Typography>
        </Box>

        {/* Tags */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {post.selectedTags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              variant="outlined"
              size="small"
            />
          ))}
        </Stack>
          {/* Media preview */}
        {post.image && (
          <CardMedia
            component="img"
            height="200"
            image={post.image}
            alt="Post media"
            sx={{ borderRadius: "8px", mt: 2 }}
          />
        )}

        {post.file && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1, cursor: "pointer" }}
            onClick={() => window.open(URL.createObjectURL(post.file))}
          >
            📄 {post.file.name}
          </Typography>
        )}

        {post.link && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1 }}
            component="a"
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 {post.link}
          </Typography>
        )}
      </CardContent>

      {/* Divider */}
      <Divider />

      {/* Footer Actions */}
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        py={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FavoriteBorderIcon fontSize="small" />
          <Typography variant="body2">{post.likes} likes</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="body2">{post.comments} comments</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <ShareOutlinedIcon fontSize="small" />
          <Typography variant="body2">{post.shares} shares</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PostCard;

