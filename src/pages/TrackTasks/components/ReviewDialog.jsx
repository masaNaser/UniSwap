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
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function ReviewDialog({
    open,
    onClose,
    task,
    onSubmitReview,
}) {
    const [reviewDecision, setReviewDecision] = React.useState('');
    const [reviewComment, setReviewComment] = React.useState('');

    const handleSubmit = () => {
        // 1. يجب دائماً اختيار قرار
        if (!reviewDecision) {
            return;
        }

        // 2. إذا كان القرار رفض (reject) والتعليق فارغ، نمنع الإرسال
        if (reviewDecision === 'reject' && !reviewComment.trim()) {
            return;
        }

        // عند القبول، نرسل سلسلة فارغة لـ reviewComment لأن الـ Backend يتجاهلها
        // عند الرفض، نرسل التعليق
        const commentToSend = reviewDecision === 'reject' ? reviewComment : '';

        onSubmitReview(task.id, reviewDecision, commentToSend);
        handleClose();
    };

    const handleClose = () => {
        setReviewDecision('');
        setReviewComment('');
        onClose();
    };

    // ⬅️ متغير لتحديد ما إذا كان زر الإرسال معطلاً
    const isSubmitDisabled = !reviewDecision || (reviewDecision === 'reject' && !reviewComment.trim());

    // ⬅️ منطق لون الخلفية للزر
    const buttonBackground = (() => {
        if (isSubmitDisabled) {
            return '#D1D5DB';
        }
        if (reviewDecision === 'accept') {
            return 'linear-gradient(to right, #3B82F6, #60A5FA)'; // أزرق عند القبول
        }
        return 'linear-gradient(to right, #DC2626, #EF4444)'; // أحمر عند الرفض
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

                {/* Review Decision */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    Review Decision
                </Typography>
                <RadioGroup
                    value={reviewDecision}
                    // عند تغيير القرار، يجب مسح التعليق لتجنب إرسال تعليق أثناء القبول إذا كان مكتوباً سابقاً
                    onChange={(e) => {
                        setReviewDecision(e.target.value);
                        setReviewComment('');
                    }}
                    sx={{ mb: 3 }}
                >
                    {/* باقي عناصر RadioGroup لم تتغير */}
                    <FormControlLabel
                        value="accept"
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleOutlineIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                                <Typography>Accept</Typography>
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
                                <Typography>Reject</Typography>
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

                {/* ⬅️ التعديل الثاني: إظهار حقل التعليق فقط عند اختيار الرفض */}
                {reviewDecision === 'reject' && (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Review Comment (Required)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder={'Please explain what needs to be improved...'}
                            sx={{ mb: 2 }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    // استخدام المتغير isSubmitDisabled
                    disabled={isSubmitDisabled}
                    sx={{
                        textTransform: 'none',
                        // ⬅️ استخدام المتغير buttonBackground
                        background: buttonBackground,
                    }}
                >
                    Send Review
                </Button>
            </DialogActions>
        </Dialog>
    );
}