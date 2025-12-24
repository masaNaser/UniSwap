import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardMedia,
  Pagination,
  useMediaQuery,
  Skeleton,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UserProjectModal from "../../../components/Modals/UserProjectModal";
import {
  GetUserProject,
  DeleteProject,
} from "../../../services/profileService";
import { useProfile } from "../../../Context/ProfileContext";
import { getImageUrl } from "../../../utils/imageHelper";
import { getToken } from "../../../utils/authHelpers";
export default function PortfolioTab() {
  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const open = Boolean(anchorEl);
  const { isMyProfile, userData } = useProfile();

  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  // isMobile سيكون true إذا كانت الشاشة أصغر من sm (600px)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const projectsPerPage = isMobile ? 4 : 6;
  // حساب المشاريع التي ستظهر في الصفحة الحالية
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  //خلي المتصفح يروح لعنوان قسم المشاريع بالضبط مهما كان حجم الشاشة.
  const projectsTopRef = useRef(null);
  // دالة لتغيير الصفحة
  const handlePageChange = (event, value) => {
    setCurrentPage(value);

    // ننتظر قليلاً حتى ينتهي الـ Render للمشاريع الجديدة
    setTimeout(() => {
      if (projectsTopRef.current) {
        // حساب موقع العنصر بالنسبة للصفحة
        const yOffset = -100; // مقدار الإزاحة للأعلى (عشان ما يختفي الـ Header)
        const y =
          projectsTopRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 10);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await GetUserProject(
        token,
        isMyProfile ? null : userData.id
      );
      setProjects(data);
      setCurrentPage(1);
      console.log("Fetched projects:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    if (!isMyProfile && !userData?.id) return;

    fetchProjects();
  }, [token, isMyProfile, userData?.id]);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      await DeleteProject(token, projectToDelete.id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setOpenModal(true);
    handleClose();
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditProject(null);
  };

  const handleSuccess = () => {
    fetchProjects();
  };

  const handleClick = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const toggleDescription = (projectId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const isLongDescription = (description) => {
    return description && description.length > 100;
  };

  return (
    <Box sx={{ width: "100%", mb: 5 }}>
      {isMyProfile && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Create Project
        </Button>
      )}

      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {[...Array(projectsPerPage)].map((_, index) => (
            <Card key={index} sx={{ borderRadius: "12px", height: "350px" }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" />
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Skeleton variant="circular" width={40} height={20} />
                  <Skeleton variant="circular" width={40} height={20} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : projects.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 5 }}
        >
          No projects yet.
        </Typography>
      ) : (
        <Box
          ref={projectsTopRef}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            mb: 5,
          }}
        >
          {currentProjects.map((p) => (
            <Card
              key={p.id}
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              {isMyProfile && (
                <IconButton
                  onClick={(e) => handleClick(e, p)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    zIndex: 10,
                    "&:hover": {
                      bgcolor: "white",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s",
                  }}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              )}

              {p.coverImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(p.coverImage, p.title)}
                  alt={p.title}
                  sx={{
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              )}

              <CardContent
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: "auto",
                  }}
                >
                  {p.title}
                </Typography>

                {/* Description with Read More and Scroll */}
                <Box sx={{ mb: 1, minHeight: "70px" }}>
                  {!expandedDescriptions[p.id] ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "13px",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {p.description}
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        maxHeight: "60px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        pr: 0.5,
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#F3F4F6",
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#D1D5DB",
                          borderRadius: "4px",
                          "&:hover": {
                            background: "#9CA3AF",
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "13px",
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {p.description}
                      </Typography>
                    </Box>
                  )}
                  {isLongDescription(p.description) && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#3B82F6",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "11px",
                        mt: 0.25,
                        display: "inline-block",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDescription(p.id);
                      }}
                    >
                      {expandedDescriptions[p.id] ? "Show less" : "Read more"}
                    </Typography>
                  )}
                </Box>

                {/* Tags Section */}
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}
                >
                  {p.tags?.slice(0, 3).map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: "rgb(0 0 0 / 6%)",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                  {p.tags?.length > 3 && (
                    <>
                      <Chip
                        label="..."
                        size="small"
                        sx={{
                          bgcolor: "rgb(0 0 0 / 6%)",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          const parent = e.currentTarget.parentNode;
                          const hiddenChips =
                            parent.querySelectorAll(".hidden-chip");
                          hiddenChips.forEach(
                            (chip) => (chip.style.display = "inline-flex")
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {p.tags.slice(3).map((tag, idx) => (
                        <Chip
                          key={idx + 3}
                          label={tag}
                          size="small"
                          className="hidden-chip"
                          sx={{
                            bgcolor: "rgb(0 0 0 / 6%)",
                            display: "none",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </>
                  )}
                </Box>

                {/* Bottom Section - Duration and Project File */}
                <Box sx={{ mt: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1.5,
                    }}
                  >
                    {p.duration && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {p.duration}
                        </Typography>
                      </Box>
                    )}

                    {p.projectFilePath &&
                      typeof p.projectFilePath === "string" && (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
                          component="a"
                          href={`https://uni1swap.runasp.net/${p.projectFilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                            px: 1,
                            minWidth: "auto",
                          }}
                        >
                          View File
                        </Button>
                      )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => handleEdit(selectedProject)}>
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit Project
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(selectedProject)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete Project
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{projectToDelete?.title}"? You
            won't be able to revert this!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: "#6B7280",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#EF4444",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Yes, delete it!
          </Button>
        </DialogActions>
      </Dialog>

      <UserProjectModal
        open={openModal}
        onClose={handleModalClose}
        token={token}
        onSuccess={handleSuccess}
        editData={editProject}
      />
      {/* Pagination UI */}
      {!loading && projects.length > projectsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(projects.length / projectsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            size={isMobile ? "small" : "medium"} // تصغير الحجم في الموبايل
            siblingCount={isMobile ? 0 : 1} // تقليل عدد الأرقام الجانبية في الموبايل
          />
        </Box>
      )}
    </Box>
  );
}
