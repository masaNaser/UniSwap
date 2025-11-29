import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

const ShareDialog = ({ open, onClose, post, onShareSuccess }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // إنشاء رابط البوست مع query parameter
  //window.location.origin returns the protocol + hostname + port of the current URL.
  const postUrl = `${window.location.origin}/app/feed?postId=${post?.id}`;
  
  // نص المشاركة
  const shareText = `Check out this post: "${post?.content?.substring(0, 100)}${post?.content?.length > 100 ? '...' : ''}"`;

  // ✅ نسخ الرابط - بزيد الـ counter
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      
      // ✅ زيادة الـ share count
      if (onShareSuccess) {
        onShareSuccess(post.id);
      }
      
      setSnackbar({
        open: true,
        message: "Link copied to clipboard! ✓",
        severity: "success",
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to copy link",
        severity: "error",
      });
    }
  };

  // ✅ المشاركة عبر WhatsApp - بزيد الـ counter
  // const handleWhatsAppShare = () => {
  //   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(postUrl)}`;
  //   window.open(whatsappUrl, "_blank");
    
  //   // ✅ زيادة الـ share count
  //   if (onShareSuccess) {
  //     onShareSuccess(post.id);
  //   }
    
  //   setSnackbar({
  //     open: true,
  //     message: "Opening WhatsApp...",
  //     severity: "success",
  //   });
    
  //   setTimeout(() => {
  //     onClose();
  //   }, 1500);
  // };

  // // ✅ المشاركة عبر Telegram - بزيد الـ counter
  // const handleTelegramShare = () => {
  //   const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`;
  //   window.open(telegramUrl, "_blank");
    
  //   // ✅ زيادة الـ share count
  //   if (onShareSuccess) {
  //     onShareSuccess(post.id);
  //   }
    
  //   setSnackbar({
  //     open: true,
  //     message: "Opening Telegram...",
  //     severity: "success",
  //   });
    
  //   setTimeout(() => {
  //     onClose();
  //   }, 1500);
  // };

  // // ✅ المشاركة عبر Facebook - بزيد الـ counter
  // const handleFacebookShare = () => {
  //   const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
  //   window.open(facebookUrl, "_blank", "width=600,height=400");
    
  //   // ✅ زيادة الـ share count
  //   if (onShareSuccess) {
  //     onShareSuccess(post.id);
  //   }
    
  //   setSnackbar({
  //     open: true,
  //     message: "Opening Facebook...",
  //     severity: "success",
  //   });
    
  //   setTimeout(() => {
  //     onClose();
  //   }, 1500);
  // };

  // // ✅ المشاركة عبر Twitter - بزيد الـ counter
  // const handleTwitterShare = () => {
  //   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
  //   window.open(twitterUrl, "_blank", "width=600,height=400");
    
  //   // ✅ زيادة الـ share count
  //   if (onShareSuccess) {
  //     onShareSuccess(post.id);
  //   }
    
  //   setSnackbar({
  //     open: true,
  //     message: "Opening Twitter...",
  //     severity: "success",
  //   });
    
  //   setTimeout(() => {
  //     onClose();
  //   }, 1500);
  // };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!post) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Share Post
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Post Preview */}
          <Box
            sx={{
              bgcolor: "#f8f9fa",
              borderRadius: "12px",
              p: 2,
              mb: 3,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <Avatar src={post.user?.avatar} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {post.user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.time}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              {post.content?.length > 150
                ? `${post.content.substring(0, 150)}...`
                : post.content}
            </Typography>
            
            {post.selectedTags?.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {post.selectedTags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Copy Link Option */}
          <Box
            sx={{
              bgcolor: "#f8f9fa",
              borderRadius: "12px",
              p: 2,
              mb: 2,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LinkIcon sx={{ color: "#6c757d" }} />
              <Typography variant="subtitle2" fontWeight="bold">
                Post Link
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  bgcolor: "white",
                  p: 1.5,
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#6c757d",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {postUrl}
              </Typography>
              <Button
                variant="contained"
                startIcon={<CopyIcon />}
                onClick={handleCopyLink}
                sx={{
                  textTransform: "none",
                  bgcolor: "#3b82f6",
                  "&:hover": { bgcolor: "#2563eb" },
                }}
              >
                Copy
              </Button>
            </Box>
          </Box>

          {/* <Divider sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Or share via
            </Typography>
          </Divider>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppShare}
              sx={{
                textTransform: "none",
                borderColor: "#25D366",
                color: "#25D366",
                "&:hover": {
                  borderColor: "#25D366",
                  bgcolor: "rgba(37, 211, 102, 0.1)",
                },
                py: 1.5,
              }}
            >
              WhatsApp
            </Button>

            <Button
              variant="outlined"
              startIcon={<TelegramIcon />}
              onClick={handleTelegramShare}
              sx={{
                textTransform: "none",
                borderColor: "#0088cc",
                color: "#0088cc",
                "&:hover": {
                  borderColor: "#0088cc",
                  bgcolor: "rgba(0, 136, 204, 0.1)",
                },
                py: 1.5,
              }}
            >
              Telegram
            </Button>

            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookShare}
              sx={{
                textTransform: "none",
                borderColor: "#1877f2",
                color: "#1877f2",
                "&:hover": {
                  borderColor: "#1877f2",
                  bgcolor: "rgba(24, 119, 242, 0.1)",
                },
                py: 1.5,
              }}
            >
              Facebook
            </Button>

            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              onClick={handleTwitterShare}
              sx={{
                textTransform: "none",
                borderColor: "#1DA1F2",
                color: "#1DA1F2",
                "&:hover": {
                  borderColor: "#1DA1F2",
                  bgcolor: "rgba(29, 161, 242, 0.1)",
                },
                py: 1.5,
              }}
            >
              Twitter
            </Button>
          </Box> */}
        </DialogContent>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            bgcolor: snackbar.severity === "success" ? "#3b82f6" : "#EF4444",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialog;