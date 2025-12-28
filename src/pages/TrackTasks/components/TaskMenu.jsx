import { Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskMenu({
  anchorEl,
  onClose,
  onEdit,
  onDelete,
}) {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={handleEdit}>
        <EditIcon sx={{ mr: 1, fontSize: 18 }} />
        Edit
      </MenuItem>
      <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
        <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
        Delete
      </MenuItem>
    </Menu>
  );
}