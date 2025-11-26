import React, { useState, useEffect } from "react";
import { GetPendingReports, GetOneReports, ReviewReport } from "../../../../services/adminService";
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
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { getImageUrl } from "../../../../utils/imageHelper";

export default function ReportsTab() {
  const token = localStorage.getItem("accessToken");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // **حالة للتقرير المفرد**
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all pending reports
  const fetchPendingReports = async () => {
    try {
      const { data } = await GetPendingReports(token);
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch one report by ID
  const fetchReportById = async (id) => {
    try {
      const { data } = await GetOneReports(token, id);
      setSelectedReport(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Review report (Accept / Reject)
  const handleReview = async (accept) => {
    try {
      const { data } = await ReviewReport(token, selectedReport.id, accept);
      console.log(data);
      setModalOpen(false);
      fetchPendingReports(); // تحديث القائمة بعد الموافقة أو الرفض
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingReports();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (reports.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">لا توجد تقارير معلقة</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 3, cursor: "pointer" }}
              onClick={() => fetchReportById(report.id)}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#f44336" }}>
                    <WarningAmberIcon />
                  </Avatar>
                }
                title={`Reporter: ${report.reporterId.substring(0, 8)}...`}
                subheader={`Reported User: ${report.reportedUserId.substring(0, 8)}...`}
              />
              {report.img && (
                <CardMedia
                  component="img"
                  height="180"
                  image={getImageUrl(report.img)}
                  alt="Report image"
                />
              )}
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight={500}>
                    Reason:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.reason}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label={report.status}
                      color={
                        report.status === "Pending"
                          ? "warning"
                          : report.status === "Resolved"
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      {new Date(report.createdAt).toLocaleString("ar-EG")}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal للتقرير الواحد */}
      {selectedReport && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Report Details</DialogTitle>
          <DialogContent>
            {selectedReport.img && (
              <img
                src={getImageUrl(selectedReport.img)}
                alt="report"
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}
            <Typography variant="subtitle1" fontWeight={500}>
              Reason:
            </Typography>
            <Typography variant="body2" mb={2}>
              {selectedReport.reason}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Status: {selectedReport.status}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Created At: {new Date(selectedReport.createdAt).toLocaleString("ar-EG")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => handleReview(false)}>
              Reject
            </Button>
            <Button color="success" onClick={() => handleReview(true)}>
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
