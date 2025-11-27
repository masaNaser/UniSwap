import React, { useState, useEffect } from "react";
import {
  GetPendingReports,
  GetOneReports,
  ReviewReport,
} from "../../../../services/adminService";

import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import { getImageUrl } from "../../../../utils/imageHelper";

// ✅ استقبلنا onReportReviewed كـ prop
export default function ReportsTab({ onReportReviewed }) {
  const token = localStorage.getItem("accessToken");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPendingReports = async () => {
    try {
      const { data } = await GetPendingReports(token);
      console.log("report:", data);
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportById = async (id) => {
    try {
      const { data } = await GetOneReports(token, id);
      setSelectedReport(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (accept) => {
    try {
      const response = await ReviewReport(token, selectedReport.id, accept);
      console.log("handleReview", response);
      setModalOpen(false);
      
      // ✅ حدّث قائمة التقارير المحلية
      fetchPendingReports();
      
      // ✅ حدّث الـ stats في الـ Dashboard (العداد رح يقل تلقائي)
      if (onReportReviewed) {
        onReportReviewed();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingReports();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress size={45} />
      </Box>
    );

  if (reports.length === 0)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          no pending Reports
        </Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
                transition: "0.25s",
                position: "relative",
                paddingTop: "35px",
                ":hover": { transform: "scale(1.02)", boxShadow: 4 },
                cursor: "pointer",
              }}
              onClick={() => fetchReportById(report.id)}
            >
              {/* Pending label on top-left */}
              <Chip
                label={report.status}
                color="warning"
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  fontWeight: 600,
                  zIndex: 2,
                }}
              />

              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#ff9800" }}>
                    <WarningAmberIcon />
                  </Avatar>
                }
                titleTypographyProps={{ fontWeight: 600 }}
                title={`Reporter: ${report.reporterName}`}
                subheader={`Reported user: ${report.reportedUserName}`}
              />

              {report.img && (
                <CardMedia
                  component="img"
                  height="180"
                  image={getImageUrl(report.img)}
                  style={{ objectFit: "cover" }}
                />
              )}

              <CardContent>
                <Stack spacing={1.3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Reason:
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {report.reason}
                  </Typography>

                  <Divider sx={{ my: 1 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedReport && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
            Report Details
          </DialogTitle>

          <DialogContent dividers>
            {selectedReport.img && (
              <img
                src={getImageUrl(selectedReport.img)}
                alt="report"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              />
            )}

            <Stack spacing={1.5}>
              <Typography fontWeight={600}>Reason:</Typography>
              <Typography color="text.secondary">
                {selectedReport.reason}
              </Typography>

              <Divider />

              <Typography variant="body2">
                Status:{" "}
                <strong style={{ color: "#ff9800" }}>
                  {selectedReport.status}
                </strong>
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => handleReview(false)}
              sx={{
                borderRadius: 8,
                textTransform: "none",
                fontSize: 16,
                padding: "10px 20px",
                border: "2px solid #ff4d4d",
                color: "#ff4d4d",
                background: "transparent",
                transition: "0.2s",
                "&:hover": {
                  background: "#ff4d4d",
                  color: "white",
                },
              }}
            >
              Reject
            </Button>

            <Button
              onClick={() => handleReview(true)}
              sx={{
                borderRadius: 8,
                textTransform: "none",
                fontSize: 16,
                padding: "10px 20px",
                border: "2px solid #00C8FF",
                color: "#00C8FF",
                background: "transparent",
                transition: "0.25s",
                "&:hover": {
                  background: "linear-gradient(to right,#00C8FF,#8B5FF6)",
                  color: "white",
                  borderColor: "transparent",
                },
              }}
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}