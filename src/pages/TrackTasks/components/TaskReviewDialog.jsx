import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    Alert,
    Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { formatDateTime } from "../../../utils/timeHelper";

export default function TaskReviewDialog({
    open,
    onClose,
    task,
    onSubmitReview,
}) {
    const [reviewDecision, setReviewDecision] = React.useState('');
    const [reviewComment, setReviewComment] = React.useState('');

    const handleSubmit = () => {
        if (!reviewDecision) {
            return;
        }

        if (reviewDecision === 'reject' && !reviewComment.trim()) {
            return;
        }

        const commentToSend = reviewDecision === 'reject' ? reviewComment : '';
        onSubmitReview(task.id, reviewDecision, commentToSend);
        handleClose();
    };

    const handleClose = () => {
        setReviewDecision('');
        setReviewComment('');
        onClose();
    };

    const isSubmitDisabled = !reviewDecision || (reviewDecision === 'reject' && !reviewComment.trim());

    const buttonBackground = (() => {
        if (isSubmitDisabled) {
            return '#D1D5DB';
        }
        if (reviewDecision === 'accept') {
            return 'linear-gradient(to right, #3B82F6, #60A5FA)';
        }
        return 'linear-gradient(to right, #DC2626, #EF4444)';
    })();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                Review Task
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {/* Task Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {task?.title}
                    </Typography>
                    {task?.description && (
                        <Typography variant="body2" color="text.secondary">
                            {task.description}
                        </Typography>
                    )}
                </Box>

                {/* ✅ Review Due Date Display */}
                {task?.reviewDueAt && (
                    <>
                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                bgcolor: '#F3F4F6',
                                borderRadius: 1,
                                border: '1px solid #9CA3AF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <AccessTimeIcon
                                sx={{
                                    color: '#6B7280',
                                    fontSize: 24,
                                }}
                            />

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    sx={{ color: '#374151', mb: 0.5 }}
                                >
                                    Review Deadline
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#374151' }}>
                                    {formatDateTime(task.reviewDueAt)}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#374151',
                                        display: 'block',
                                        mt: 0.5,
                                    }}
                                >
                                    The task will be automatically approved if no review is submitted by this deadline.
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />
                    </>
                )}

                {/* Review Decision */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    Review Decision
                </Typography>
                <RadioGroup
                    value={reviewDecision}
                    onChange={(e) => {
                        setReviewDecision(e.target.value);
                        setReviewComment('');
                    }}
                    sx={{ mb: 3 }}
                >
                    <FormControlLabel
                        value="accept"
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleOutlineIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                                <Typography fontWeight="500">Accept Task</Typography>
                            </Box>
                        }
                        sx={{
                            border: reviewDecision === 'accept' ? '2px solid #3B82F6' : '1px solid #E5E7EB',
                            borderRadius: 1,
                            p: 1.5,
                            mb: 1,
                            ml: 0,
                            bgcolor: reviewDecision === 'accept' ? '#EFF6FF' : 'transparent',
                        }}
                    />
                    <FormControlLabel
                        value="reject"
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CancelOutlinedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                                <Typography fontWeight="500">Reject & Request Revision</Typography>
                            </Box>
                        }
                        sx={{
                            border: reviewDecision === 'reject' ? '2px solid #DC2626' : '1px solid #E5E7EB',
                            borderRadius: 1,
                            p: 1.5,
                            ml: 0,
                            bgcolor: reviewDecision === 'reject' ? '#FEE2E2' : 'transparent',
                        }}
                    />
                </RadioGroup>

                {/* Rejection Comment Field */}
                {reviewDecision === 'reject' && (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Revision Comments (Required)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={'Please explain what needs to be improved or changed...'}
                            sx={{ mb: 2 }}
                            error={reviewDecision === 'reject' && !reviewComment.trim()}
                            helperText={
                                reviewDecision === 'reject' && !reviewComment.trim()
                                    ? 'Comment is required for rejection'
                                    : 'Be specific about what needs to be fixed'
                            }
                        />
                    </>
                )}

                {/* Info Alert */}
                {reviewDecision && (
                    <Alert
                        icon={<InfoOutlinedIcon />}
                        severity={reviewDecision === 'accept' ? 'info' : 'error'}
                        sx={{
                            bgcolor: reviewDecision === 'accept' ? '#EFF6FF' : '#FEE2E2',
                            border: reviewDecision === 'accept' ? '1px solid #3B82F6' : '1px solid #DC2626',
                            '& .MuiAlert-icon': {
                                color: reviewDecision === 'accept' ? '#3B82F6' : '#DC2626',
                            },
                        }}
                    >
                        <Typography variant="body2" sx={{ color: reviewDecision === 'accept' ? '#1E40AF' : '#991B1B' }}>
                            {reviewDecision === 'accept' ? (
                                <>
                                    <strong>What happens next:</strong> The task will be marked as Done and
                                    progress will be updated automatically.
                                </>
                            ) : (
                                <>
                                    <strong>What happens next:</strong> The task will return to In Progress
                                    status and the provider will see your feedback.
                                </>
                            )}
                        </Typography>
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitDisabled}
                    sx={{
                        textTransform: 'none',
                        background: buttonBackground,
                        '&:disabled': {
                            background: '#D1D5DB',
                            color: '#9CA3AF',
                        },
                    }}
                >
                    {reviewDecision === 'accept' ? 'Accept Task' : reviewDecision === 'reject' ? 'Reject Task' : 'Send Review'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}