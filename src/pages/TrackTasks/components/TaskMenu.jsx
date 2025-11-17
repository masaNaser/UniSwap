import { Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskMenu({
  anchorEl,
  selectedTask,
  onClose,
  onEdit,
  onDelete,
}) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onEdit}>
        <EditIcon sx={{ mr: 1, fontSize: 18 }} />
        Edit
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
        Delete
      </MenuItem>
    </Menu>
  );
}
