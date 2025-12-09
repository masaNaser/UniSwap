import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
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
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import UserProjectModal from "../../../components/Modals/UserProjectModal";
import {GetUserProject,DeleteProject} from "../../../services/profileService";
import { useProfile } from "../../../Context/ProfileContext";
import { getImageUrl } from "../../../utils/imageHelper";

export default function PortfolioTab() {
  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const open = Boolean(anchorEl);
  const { isMyProfile, userData } = useProfile();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await GetUserProject(
        token,
        isMyProfile ? null : userData.id
      );
      setProjects(data);
      console.log("Fetched projects:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <Box sx={{ width: "100%", mb: 5 }}>
      {isMyProfile && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Create Project
        </Button>
      )}

      {loading ? (
        <CircularProgress />
      ) : projects.length === 0 ? (
        <Typography>No projects yet.</Typography>
      ) : (
        <Box
        sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 3,
    mt: 0,
    justifyContent:"space-between",
    mb: 5,
  }}
>
  {projects.map((p) => (
    <Box
      key={p.id}
       sx={{
        width: {
          xs: "100%",
          sm: "calc(40% - 30px)", 
          md: "calc(40% - 30px)",
        },
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {isMyProfile && (
        <IconButton
          onClick={(e) => handleClick(e, p)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "white",
            boxShadow: 1,
            zIndex: 1,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )}

      {p.coverImage && (
        <Box
          component="img"
          src={getImageUrl(p.coverImage, p.title)}
          alt={p.title}
          sx={{
            width: "100%",
            height: { xs: 180, sm: 200, md: 220 },
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {p.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          {p.description}
        </Typography>

        {/* عرض ملف المشروع بشكل آمن */}
{p.projectFilePath && typeof p.projectFilePath === "string" && (
  <Box sx={{ mt: 1 }}>
    <Button
      variant="outlined"
      size="small"
      startIcon={<FolderIcon />}
      component="a"
      href={`https://uni1swap.runasp.net/${p.projectFilePath}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ textTransform: "none" }}
    >
      View Project File
    </Button>
  </Box>
)}

        <Box display="flex" justifyContent={"space-between"}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {p.tags && p.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="medium"
                fontWeight="700"
                sx={{ bgcolor: '#F3F4F6', color: "rgba(51, 65, 85, 1)" }}
              />
            ))}
          </Box>
          <Box>
            <Typography
              variant="span"
              fontWeight="700"
              fontSize="15px"
              color="rgba(71, 85, 105, 1)"
            >
              Duration: 
            </Typography>
            <Typography
              variant="span"
              fontWeight="400"
              fontSize="15px"
              color="rgba(71, 85, 105, 1)"
            >
              {p.duration}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
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

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{projectToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
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
    </Box>
  );
}
