import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  CardMedia,
  Pagination,
  useMediaQuery,
  useTheme,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UserProjectModal from "../../../components/Modals/UserProjectModal";
import {GetUserProject,DeleteProject,} from "../../../services/profileService";
import { useProfile } from "../../../Context/ProfileContext";
import { getImageUrl } from "../../../utils/imageHelper";
import { getToken } from "../../../utils/authHelpers";
import ProjectCardSkeleton from "../../../components/Skeletons/ProjectCardSkeleton";
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
    {/* زر إضافة مشروع - يظهر فقط للمالك */}
    {isMyProfile && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenModal(true)}
        sx={{ 
          mb: 3, 
          borderRadius: "8px", 
          textTransform: "none",
          fontWeight: "bold",
          px: 3
        }}
      >
        CREATE PROJECT
      </Button>
    )}

    {/* حاوية المشاريع الرئيسية - تستخدم Grid Layout */}
    <Box
      ref={projectsTopRef}
      sx={{
        display: "grid",
        // هنا السر في توزيع 3 كروت: md: 3 تعني تقسيم العرض لـ 3 أعمدة متساوية
        gridTemplateColumns: {
          xs: "1fr",          // موبايل: كرت واحد
          sm: "repeat(2, 1fr)", // تابلت: كرتين
          md: "repeat(3, 1fr)", // لابتوب: 3 كروت
        },
        gap: 3, // المسافة بين الكروت
        mb: 5,
      }}
    >
      {loading ? (
        /* حالة التحميل: استدعاء الـ Skeleton المستقل */
        <ProjectCardSkeleton count={isMobile ? 4 : 6} />
      ) : projects.length === 0 ? (
        /* حالة عدم وجود بيانات - نجعل النص يأخذ عرض الصف كاملاً */
        <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No projects added yet.
          </Typography>
        </Box>
      ) : (
        /* عرض المشاريع الحقيقية */
        currentProjects.map((p) => (
          <Card
            key={p.id}
            sx={{
              borderRadius: "16px", // مطابقة للصورة
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              border: "1px solid #f0f0f0",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            {/* أيقونة القائمة للمالك */}
            {isMyProfile && (
              <IconButton
                onClick={(e) => handleClick(e, p)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 10,
                  "&:hover": { bgcolor: "white" },
                }}
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            )}

            {/* صورة المشروع */}
            {p.coverImage && (
              <CardMedia
                component="img"
                height="200"
                image={getImageUrl(p.coverImage, p.title)}
                alt={p.title}
                sx={{ objectFit: "cover" }}
              />
            )}

            <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                {p.title}
              </Typography>

              {/* وصف المشروع مع Read More */}
              <Box sx={{ mb: 1, minHeight: "60px" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "13px",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: expandedDescriptions[p.id] ? "none" : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: expandedDescriptions[p.id] ? "visible" : "hidden",
                  }}
                >
                  {p.description}
                </Typography>
                {isLongDescription(p.description) && (
                  <Typography
                    variant="caption"
                    onClick={(e) => { e.stopPropagation(); toggleDescription(p.id); }}
                    sx={{ color: "#3B82F6", cursor: "pointer", fontWeight: "600", mt: 0.5, display: "block" }}
                  >
                    {expandedDescriptions[p.id] ? "Show less" : "Read more"}
                  </Typography>
                )}
              </Box>

              {/* قسم الـ Tags */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                {p.tags?.slice(0, 3).map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" sx={{ height: 24, fontSize: "11px" }} />
                ))}
              </Box>

              {/* الجزء السفلي (المدة والملف) */}
              <Box sx={{ mt: "auto", pt: 1.5, borderTop: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">{p.duration}</Typography>
                </Box>
                {p.projectFilePath && (
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
                    href={`https://uni1swap.runasp.net/${p.projectFilePath}`}
                    target="_blank"
                    sx={{ textTransform: "none", fontSize: "12px" }}
                  >
                    View File
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>

    {/* القوائم والدايالوج (Menu, Delete Dialog, Modal) تظل كما هي تحت */}
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
       <MenuItem onClick={() => handleEdit(selectedProject)}><EditIcon fontSize="small" sx={{mr:1}}/> Edit</MenuItem>
       <MenuItem onClick={() => handleDeleteClick(selectedProject)} sx={{color:'error.main'}}><DeleteIcon fontSize="small" sx={{mr:1}}/> Delete</MenuItem>
    </Menu>

    {/* الترقيم (Pagination) */}
    {!loading && projects.length > projectsPerPage && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(projects.length / projectsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
    )}
     
     
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
               <Box sx={{ pt: 1 }}>Are you sure you want to delete the project <strong>"{projectToDelete?.title}"</strong>? 
      This action cannot be undone.</Box>
             </DialogContent>
             <DialogActions sx={{ px: 3, pb: 2 }}>
               <Button
                 onClick={handleCancelDelete}
                 sx={{
                   color: "#6B7280",
                   textTransform: "none",
                 }}
               >
                 No, keep it
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





    {/* المودال الخاص بالإضافة والتعديل */}
    <UserProjectModal
      open={openModal}
      onClose={handleModalClose}
      token={token}
      onSuccess={handleSuccess}
      editData={editProject}
    />
  </Box>
);
}
