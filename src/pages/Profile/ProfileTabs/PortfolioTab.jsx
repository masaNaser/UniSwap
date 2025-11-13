import React, { useState, useEffect } from "react";
import { 
  Button, Grid, Card, CardContent, Typography, IconButton, CircularProgress, Box, Chip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UserProjectModal from "../../../components/Modals/UserProjectModal";
import { GetUserProject, DeleteProject } from "../../../services/profileService";
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
      const { data } = await GetUserProject(token, isMyProfile ? null : userData.id);
      setProjects(data);
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
    handleClose(); // يغلق المينيو إذا كان مفتوح
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
    <div>
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
        <Typography>No projects yet. Create your first project!</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((p) => (
            <Grid item xs={12} sm={6} md={6} key={p.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                  },
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {isMyProfile && (
                  <IconButton
                    onClick={(e) => handleClick(e, p)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'white',
                      boxShadow: 1,
                      zIndex: 1,
                      '&:hover': { bgcolor: 'grey.100' }
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
                      width: '100%',
                      height: { xs: 180, sm: 200, md: 220 },
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                )}

                {p.points && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: p.coverImage ? { xs: 140, sm: 160, md: 180 } : 8,
                      right: 16,
                      bgcolor: 'white',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      boxShadow: 2,
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    {p.points} pts
                  </Box>
                )}

                <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {p.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {p.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {p.tags && p.tags.map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#F3F4F6' }} />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    {p.client && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Client:
                        </Typography>
                        <Typography variant="body2">{p.client}</Typography>
                      </Box>
                    )}
                    {p.duration && (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="rgba(71, 85, 105, 1)" sx={{ fontWeight: 800,fontSize:15 }}>
                          Duration: <Typography variant="span" sx={{ fontWeight: 400,fontSize:12 }}>{p.duration}</Typography>
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* {p.testimonial && (
                    <Box sx={{ bgcolor: '#F9FAFB', borderRadius: 2, p: 1.5, mt: 1, borderLeft: '3px solid #1976d2' }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        "{p.testimonial}"
                      </Typography>
                    </Box>
                  )} */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ mt: 1 }}>
        <MenuItem onClick={() => handleEdit(selectedProject)}>
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit Project
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedProject)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete Project
        </MenuItem>
      </Menu>

      {/* Dialog لتأكيد الحذف */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{projectToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <UserProjectModal
        open={openModal}
        onClose={handleModalClose}
        token={token}
        onSuccess={handleSuccess}
        editData={editProject}
      />
    </div>
  );
}
