import React, { useState } from "react";
import {
  Box,
  Menu,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Chip,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UpdateIcon from "@mui/icons-material/Update";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationIcon from "../../assets/images/NotificationIcon.svg";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageHelper";

const NotificationMenu = ({
  notifications,
  unreadNotificationCount,
  markAsRead,
  markAllAsRead,
  clearAll,
}) => {
  const navigate = useNavigate();
  const [notifAnchor, setNotifAnchor] = useState(null);

  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  // 🔥 تحويل الوقت لـ timestamp للترتيب
  const parseTimeAgo = (timeAgo) => {
    if (!timeAgo) return Date.now();
    
    const now = Date.now();
    const match = timeAgo.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/i);
    
    if (!match) return now;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    const multipliers = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    
    return now - (value * (multipliers[unit] || 0));
  };

  // 🔥 ترتيب الإشعارات حسب الوقت (الأحدث أولاً)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = parseTimeAgo(a.timeAgo);
    const timeB = parseTimeAgo(b.timeAgo);
    return timeB - timeA;
  });

  // أسماء المجموعات
  const groupLabels = {
    posts: "Posts",
    collaboration: "Collaboration",
    project: "Projects",
    requestProjectTasks: "Tasks",
    "Task Created": "Tasks",
    messages: "Messages",
    Other: "Other",
  };

  // ألوان الـ Groups
  const groupColors = {
    posts: { bg: "#EFF6FF", text: "#3B82F6" },
    collaboration: { bg: "#F3E8FF", text: "#8B5CF6" },
    project: { bg: "#D1FAE5", text: "#10B981" },
    requestProjectTasks: { bg: "#DBEAFE", text: "#3B82F6" },
    "Task Created": { bg: "#DBEAFE", text: "#3B82F6" },
    messages: { bg: "#FEF3C7", text: "#F59E0B" },
    Other: { bg: "#F3F4F6", text: "#6B7280" },
  };

  // أيقونات المجموعات
  const groupIcons = {
    posts: <CommentIcon sx={{ fontSize: 14 }} />,
    collaboration: <PersonAddIcon sx={{ fontSize: 14 }} />,
    project: <AssignmentIcon sx={{ fontSize: 14 }} />,
    requestProjectTasks: <AssignmentIcon sx={{ fontSize: 14 }} />,
    "Task Created": <AssignmentIcon sx={{ fontSize: 14 }} />,
    messages: <CommentIcon sx={{ fontSize: 14 }} />,
  };

  const handleNotifItemClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    let targetRoute = "/app/feed";

    switch (notification.refType) {
      case "Post":
      case "Liked":
      case "Comment":
      case "Commented":
      case "Shared":
      case "Mentioned":
        targetRoute = "/app/feed";
        break;

      case "Project":
      case "Rating":
      case "Rated":
      case "Completed":
      case "Assigned":
      case "Approved":
      case "Rejected":
        targetRoute = `/app/project/${notification.refId}`;
        break;

      case "Collaboration":
        targetRoute = notification.refId
          ? `/app/project/${notification.refId}`
          : "/app/project";
        break;

      case "RequestProject":
        targetRoute = notification.refId
          ? `/app/project/${notification.refId}`
          : "/app/project";
        break;

      case "Message":
        targetRoute = "/chat";
        break;

      case "User":
      case "Followed":
        targetRoute = `/app/profile/${notification.refId}`;
        break;

      case "Task":
      case "Updated":
        targetRoute = `/app/TrackTasks/${notification.refId}`;
        break;

      default:
        console.warn(`Unknown notification type: ${notification.refType}`);
        targetRoute = "/app/feed";
    }

    navigate(targetRoute);
    handleNotifClose();
  };

  const getNotificationIcon = (titleOrVerb) => {
    const iconStyle = { fontSize: "18px" };

    const icons = {
      Liked: <FavoriteIcon sx={{ ...iconStyle, color: "#EF4444" }} />,
      Commented: <CommentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
      Shared: <ShareIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Mentioned: <CampaignIcon sx={{ ...iconStyle, color: "#F59E0B" }} />,
      Followed: <PersonAddIcon sx={{ ...iconStyle, color: "#8B5CF6" }} />,
      Rated: <StarIcon sx={{ ...iconStyle, color: "#FBBF24" }} />,
      Completed: <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Assigned: <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
      "Request Accepted": <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      "Request Rejected": <CancelIcon sx={{ ...iconStyle, color: "#EF4444" }} />,
      Updated: <UpdateIcon sx={{ ...iconStyle, color: "#6366F1" }} />,
      Approved: <ThumbUpIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Rejected: <CancelIcon sx={{ ...iconStyle, color: "#EF4444" }} />,
      Deleted: <DeleteOutlineOutlinedIcon sx={{ ...iconStyle, color: "#9CA3AF" }} />,
      "Task Created": <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
      "Task Completed": <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      "Task Request": <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
      "Project Overdue": <UpdateIcon sx={{ ...iconStyle, color: "#F59E0B" }} />,
      Notification: <NotificationsNoneIcon sx={{ ...iconStyle, color: "#6366F1" }} />,
      "New Message": <CommentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
    };

    return icons[titleOrVerb] || <NotificationsNoneIcon sx={{ ...iconStyle, color: "#6B7280" }} />;
  };

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleNotifClick}
        sx={{ p: 1 }}
      >
        <Badge badgeContent={unreadNotificationCount} color="error" max={99}>
          <img
            src={NotificationIcon}
            alt="Notification Icon"
            style={{
              height: "20px",
              width: "20px",
              display: "block",
            }}
          />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleNotifClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            maxHeight: 500,
            width: 420,
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsNoneIcon sx={{ color: "#374151", fontSize: 22 }} />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem",
                color: "#111827",
              }}
            >
              Notifications
            </Typography>
            {unreadNotificationCount > 0 && (
              <Box
                sx={{
                  bgcolor: "#EF4444",
                  color: "white",
                  borderRadius: "12px",
                  px: 1,
                  py: 0.25,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  minWidth: "20px",
                  textAlign: "center",
                }}
              >
                {unreadNotificationCount}
              </Box>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={handleNotifClose}
            sx={{
              color: "#6B7280",
              "&:hover": { bgcolor: "#F3F4F6" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              bgcolor: "white",
              display: "flex",
              gap: 1,
              // borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
              onClick={markAllAsRead}
              disabled={!notifications.some((n) => !n.isRead)}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                color: "#3B82F6",
                borderColor: "#3B82F6",
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#EFF6FF",
                },
                "&.Mui-disabled": {
                  color: "#9CA3AF",
                  opacity: 0.6,
                },
              }}
            >
              Mark all read
            </Button>

            {clearAll && notifications.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={clearAll}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: "#EF4444",
                  borderColor: "#EF4444",
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#FEF2F2",
                  },
                }}
              >
                Clear all
              </Button>
            )}
          </Box>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <Box sx={{ p: 6, textAlign: "center", bgcolor: "white" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ color: "#374151", fontWeight: 600, mb: 0.5 }}
            >
              No notifications yet !
            </Typography>
          </Box>
        )}

        {/* 🔥 Sorted Notifications - مع اسم الـ Group بس لما يتغير */}
        {sortedNotifications.length > 0 && (
          <Box sx={{ maxHeight: 400, overflowY: "auto", bgcolor: "white", p: 2 }}>
            {sortedNotifications.map((notif, index) => {
              const groupName = notif.group || "Other";
              const groupLabel = groupLabels[groupName] || groupName;
              const colors = groupColors[groupName] || groupColors.Other;

              // 🔥 نشوف إذا الـ Group تغير عن اللي قبله
              const prevGroupName = index > 0 ? (sortedNotifications[index - 1].group || "Other") : null;
              const showGroupBadge = groupName !== prevGroupName;

              return (
                <Box key={notif.id}>
                  {/* 🔥 Group Header - بس لما يتغير الـ Group */}
                  {showGroupBadge && (
                    <Box 
                      sx={{ 
                        mb: 1.5, 
                        mt: index > 0 ? 2.5 : 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {/* الأيقونة بدون background */}
                      {React.cloneElement(groupIcons[groupName] || <CommentIcon />, {
                        sx: { fontSize: 20, color: colors.text }
                      })}
                      
                      <Typography
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {groupLabel}
                      </Typography>
                      
                      {/* 🔥 الخط الرفيع جنب الاسم */}
                      <Box
                        sx={{
                          flex: 1,
                          height: "1px",
                          bgcolor: "#E5E7EB",
                          ml: 1,
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    onClick={() => handleNotifItemClick(notif)}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      cursor: "pointer",
                      borderRadius: "16px",
                      bgcolor: notif.isRead ? "#FFFFFF" : "#F0F7FF",
                      border: "1px solid #E5E7EB",
                      transition: "0.2s ease",
                      boxShadow: notif.isRead
                        ? "0 1px 3px rgba(0,0,0,0.05)"
                        : "0 2px 6px rgba(63,131,248,0.15)",
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)",
                        bgcolor: notif.isRead ? "#F9FAFB" : "#E0EEFF",
                      },
                    }}
                  >

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    {/* Avatar or Icon */}
                    <Box sx={{ position: "relative" }}>
                      {notif.userImage || notif.senderName ? (
                        <Avatar
                          key={`${notif.id}-${notif.userImage}`}
                          src={getImageUrl(notif.userImage, notif.senderName)}
                          alt={notif.senderName || "User"}
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: notif.isRead ? "#F3F4F6" : "#DBEAFE",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {getNotificationIcon(notif.title || notif.verb)}
                        </Box>
                      )}

                      {!notif.isRead && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "#3B82F6",
                            border: "2px solid white",
                          }}
                        />
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "0.9375rem",
                          mb: 0.5,
                        }}
                      >
                        {notif.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          fontSize: "0.875rem",
                          mb: 0.5,
                          overflow: "hidden",
                          lineHeight: 1.4,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {notif.message}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {notif.timeAgo}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;