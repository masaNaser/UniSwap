import React, { useState } from "react";
import {
  Box,
  Menu,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Divider,
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
import DeleteIcon from "@mui/icons-material/Delete";
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
  clearAll, // ← لحذف كل الإشعارات
}) => {
  const navigate = useNavigate();
  const [notifAnchor, setNotifAnchor] = useState(null);

  // فتح قائمة الإشعارات
  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  // إغلاق قائمة الإشعارات
  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  // تجميع الإشعارات حسب النوع
  const groupNotifications = () => {
    const groups = {};

    notifications.forEach((notif) => {
      const groupName = notif.group || "Other";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(notif);
    });

    return groups;
  };

  const groupedNotifications = groupNotifications();

  // أسماء المجموعات بالعربي
  const groupLabels = {
    posts: "Posts",
    collaboration: "Collaboration",
    project: "Projects",
    requestProjectTasks: "Tasks",
    "Task Created": "Tasks",
    messages: "Messages",
    Other: "Other",
  };

  // أيقونات المجموعات
  const groupIcons = {
    posts: <CommentIcon sx={{ fontSize: 18, color: "#3B82F6" }} />,
    collaboration: <PersonAddIcon sx={{ fontSize: 18, color: "#8B5CF6" }} />,
    project: <AssignmentIcon sx={{ fontSize: 18, color: "#10B981" }} />,
    requestProjectTasks: (
      <AssignmentIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
    ),
    "Task Created": <AssignmentIcon sx={{ fontSize: 18, color: "#3B82F6" }} />,
    messages: <CommentIcon sx={{ fontSize: 18, color: "#3B82F6" }} />,
  };

  // عند الضغط على إشعار
  const handleNotifItemClick = async (notification) => {
    // وضع علامة مقروء
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // التوجيه حسب نوع الإشعار
    let targetRoute = "/app/feed"; // Default route

    switch (notification.refType) {
      // ========== Posts & Likes & Comments ==========
      case "Post":
      case "Liked":
      case "Comment":
      case "Commented":
      case "Shared":
      case "Mentioned":
        // بما إنه الـ Feed ما بياخذ ID، بنروح على الـ Feed العادي
        targetRoute = "/app/feed";
        break;

      // ========== Projects ==========
      case "Project":
      case "Rating":
      case "Rated":
      case "Completed":
      case "Assigned":
      case "Approved":
      case "Rejected":
        // بنروح على تفاصيل المشروع
        targetRoute = `/app/project/${notification.refId}`;
        break;

      // ========== Collaboration (طلبات التعاون) ==========
      case "Collaboration":
        // لو في refId بنروح على المشروع، إذا لا بنروح على صفحة المشاريع
        targetRoute = notification.refId
          ? `/app/project/${notification.refId}`
          : "/app/project";
        break;

      // ========== Request Project (طلبات المشاريع) ==========
      case "RequestProject":
        // بنروح على تفاصيل المشروع المطلوب
        targetRoute = notification.refId
          ? `/app/project/${notification.refId}`
          : "/app/project";
        break;

      // ========== Messages ==========
      case "Message":
        // بنروح على صفحة الشات
        targetRoute = "/chat";
        break;

      // ========== Users (Follow) ==========
      case "User":
      case "Followed":
        // بنروح على بروفايل المستخدم
        targetRoute = `/app/profile/${notification.refId}`;
        break;

      // ========== Tasks ==========
      case "Task":
      case "Updated":
        // بنروح على تفاصيل المهمة
        targetRoute = `/app/TrackTasks/${notification.refId}`;
        break;

      default:
        console.warn(`Unknown notification type: ${notification.refType}`);
        targetRoute = "/app/feed";
    }

    navigate(targetRoute);
    handleNotifClose();
  };

  // أيقونة حسب نوع الإشعار
  const getNotificationIcon = (titleOrVerb) => {
    const iconStyle = { fontSize: "18px" }; // ← أصغر شوي

    const icons = {
      // ========== Interactions ==========
      Liked: <FavoriteIcon sx={{ ...iconStyle, color: "#EF4444" }} />,
      Commented: <CommentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
      Shared: <ShareIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Mentioned: <CampaignIcon sx={{ ...iconStyle, color: "#F59E0B" }} />,

      // ========== Social ==========
      Followed: <PersonAddIcon sx={{ ...iconStyle, color: "#8B5CF6" }} />,

      // ========== Projects ==========
      Rated: <StarIcon sx={{ ...iconStyle, color: "#FBBF24" }} />,
      Completed: <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Assigned: <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,

      // ========== Collaboration ==========
      "Request Accepted": (
        <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />
      ),
      "Request Rejected": (
        <CancelIcon sx={{ ...iconStyle, color: "#EF4444" }} />
      ),

      // ========== Updates ==========
      Updated: <UpdateIcon sx={{ ...iconStyle, color: "#6366F1" }} />,
      Approved: <ThumbUpIcon sx={{ ...iconStyle, color: "#10B981" }} />,
      Rejected: <CancelIcon sx={{ ...iconStyle, color: "#EF4444" }} />,
      Deleted: <DeleteIcon sx={{ ...iconStyle, color: "#9CA3AF" }} />,

      // ========== Tasks & Projects ==========
      "Task Created": (
        <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />
      ),
      "Task Completed": (
        <CheckCircleIcon sx={{ ...iconStyle, color: "#10B981" }} />
      ),
      "Task Request": (
        <AssignmentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />
      ),
      "Project Overdue": <UpdateIcon sx={{ ...iconStyle, color: "#F59E0B" }} />,
      Notification: (
        <NotificationsNoneIcon sx={{ ...iconStyle, color: "#6366F1" }} />
      ),

      // ========== Messages ==========
      "New Message": <CommentIcon sx={{ ...iconStyle, color: "#3B82F6" }} />,
    };

    return (
      icons[titleOrVerb] || (
        <NotificationsNoneIcon sx={{ ...iconStyle, color: "#6B7280" }} />
      )
    );
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
            maxHeight: 400,
            width: 420,
            borderRadius: "16px",
            overflow: "hidden",
            // bgcolor: "#F9FAFB",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* ========== Header ========== */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Left Side - Title */}
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

          {/* Right Side - Close Button */}
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

        {/* ========== Action Buttons ========== */}
        {notifications.length > 0 && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              bgcolor: "white",
              display: "flex",
              gap: 1,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            {/* Mark all read */}
            <Button
              size="small"
              startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
              onClick={markAllAsRead}
              disabled={!notifications.some((n) => !n.isRead)} // ← disabled لما كلهم مقروءين
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                color: "#3B82F6",
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#EFF6FF",
                },
                "&.Mui-disabled": {
                  color: "#9CA3AF", // ← لون رمادي لما يكون disabled
                  opacity: 0.6,
                },
              }}
            >
              Mark all read
            </Button>

            {/* Clear all */}
            {clearAll && notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                onClick={clearAll}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: "#EF4444",
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

        {/* ========== Empty State ========== */}
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
              No notifications yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              We'll notify you when something arrives
            </Typography>
          </Box>
        )}

        {/* ========== Grouped Notifications ========== */}
        {notifications.length > 0 && (
          <Box sx={{ maxHeight: 480, overflowY: "auto" }}>
            {Object.entries(groupedNotifications).map(
              ([groupName, items], groupIndex) => (
                <Box key={groupName}>
                  {/* Group Header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "1.5rem",
                    //   textTransform: "uppercase",
                    }}
                  >
                    {groupIcons[groupName] || (
                      <NotificationsNoneIcon
                        sx={{ fontSize: 18, color: "#6B7280" }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {groupLabels[groupName] || groupName}
                    </Typography>
                  </Box>

                  {/* Group Items */}
                  <Box sx={{ bgcolor: "white",padding: "12px" }}>
                    {items.map((notif, index) => (
                      <Box
                        key={notif.id}
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
                            {notif.senderImage || notif.senderName ? (
                              <Avatar
                                src={getImageUrl(
                                  notif.senderImage,
                                  notif.senderName
                                )}
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

                            {/* Blue Dot for Unread */}
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
                            {/* Title */}
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

                            {/* Message */}
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
                                lineHeight: 1.4,
                              }}
                            >
                              {notif.message}
                            </Typography>

                            {/* Time */}
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
                    ))}
                  </Box>
                </Box>
              )
            )}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
