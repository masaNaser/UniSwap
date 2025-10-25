import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    TextField,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import Point from "../../assets/images/Point.svg";
import CustomButton from "../CustomButton/CustomButton";
import DisabledCustomButton from "../CustomButton/DisabledCustomButton";

const RequestServiceModal = ({ open, onClose, projectTitle, projectId, pointsBudget: initialPoints }) => {
    const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
    const [serviceDescription, setServiceDescription] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
    const [deadline, setDeadline] = useState("");

    // Check if form is valid
    const isRequestFormValid =
        serviceTitle.trim() !== "" &&
        serviceDescription.trim() !== "" &&
        serviceCategory !== "" &&
        pointsBudget !== "" &&
        deadline !== "";

    // Handle Submit
    const handleSubmit = () => {
        const requestData = {
            title: serviceTitle,
            description: serviceDescription,
            category: serviceCategory,
            pointsOffered: parseInt(pointsBudget),
            deadline: deadline,
            publishProjectId: projectId,
        };

        console.log("Request submitted:", requestData);
        // TODO: API call here

        handleClose();
    };

    // Handle Close & Reset
    const handleClose = () => {
        setServiceTitle(projectTitle || "");
        setServiceDescription("");
        setServiceCategory("");
        setPointsBudget(initialPoints || "");
        setDeadline("");
        onClose();
    };

    // Update fields when modal opens
    useEffect(() => {
        if (open) {
            if (projectTitle) setServiceTitle(projectTitle);
            if (initialPoints) setPointsBudget(initialPoints);
        }
    }, [open, projectTitle, initialPoints]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon sx={{ color: "#3b82f6" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Request: {projectTitle}
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1, pb: 1 }}>
                {/* Service Title */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
                    >
                        Service Title <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="What service do you need?"
                        value={serviceTitle}
                        onChange={(e) => setServiceTitle(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                height: "46px",
                            },
                        }}
                    />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
                    >
                        Description <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Describe your project in detail..."
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                            },
                        }}
                    />
                </Box>

                {/* Category & Points Budget */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
                        >
                            Request Type <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                value={serviceCategory}
                                onChange={(e) => setServiceCategory(e.target.value)}
                                displayEmpty
                                sx={{
                                    borderRadius: "8px",
                                    height: "46px",
                                    "& .MuiSelect-select": {
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Request Type
                                </MenuItem>
                                <MenuItem value="Project">Project</MenuItem>
                                <MenuItem value="Course">Course</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
                        >
                            Points Budget <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="e.g., 150"
                            value={pointsBudget}
                            onChange={(e) => setPointsBudget(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img
                                            src={Point}
                                            alt="points"
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    height: "46px",
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Deadline */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="body2"
                        sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
                    >
                        Deadline
                    </Typography>
                    <TextField
                        fullWidth
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                height: "46px",
                            },
                        }}
                    />
                </Box>
            </DialogContent>

            {/* Buttons*/}
            <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
                <CustomButton
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        minWidth: "100px",
                        background: "white",
                        color: "#3b82f6",
                        border: "1px solid #3b82f6",
                    }}
                >
                    Cancel
                </CustomButton>
                {isRequestFormValid ? (
                    <CustomButton
                        onClick={handleSubmit}
                        startIcon={<SendIcon />}
                        sx={{ minWidth: "150px" }}
                    >
                        Send Request
                    </CustomButton>
                ) : (
                    <DisabledCustomButton startIcon={<SendIcon />} sx={{ minWidth: "150px" }}>
                        Send Request
                    </DisabledCustomButton>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RequestServiceModal;