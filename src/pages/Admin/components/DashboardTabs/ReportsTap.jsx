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
  Divider,
} from "@mui/material";

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { getImageUrl } from "../../../../utils/imageHelper";
import GenericModal from "../../../../components/Modals/GenericModal";

export default function ReportsTab({ onReportReviewed }) {
  const token = localStorage.getItem("accessToken");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const response = await ReviewReport(token, selectedReport.id, true);
      console.log("handleAccept", response);

      setSnackbar({
        open: true,
        message: "Report accepted successfully",
        severity: "success",
      });

      setTimeout(() => {
        setModalOpen(false);
        fetchPendingReports();
        if (onReportReviewed) {
          onReportReviewed();
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to accept report",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const response = await ReviewReport(token, selectedReport.id, false);
      console.log("handleReject", response);

      setSnackbar({
        open: true,
        message: "Report rejected successfully",
        severity: "success",
      });

      setTimeout(() => {
        setModalOpen(false);
        fetchPendingReports();
        if (onReportReviewed) {
          onReportReviewed();
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to reject report",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
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
                borderRadius: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                transition: "0.25s",
                position: "relative",
                overflow: "visible",
                pr: 4,
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.12)"
                },
                cursor: "pointer",
              }}
              onClick={() => fetchReportById(report.id)}
            >
              {/* Pending Chip positioned at top */}
              <Box sx={{ p: 2, pb: 1 }}>
                <Chip
                  label={report.status}
                  color="warning"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: "24px",
                  }}
                />
              </Box>

              <CardHeader
                sx={{ pt: 0, pb: 1.5 }}
                avatar={
                  <ReportProblemOutlinedIcon
                    sx={{
                      fontSize: 32,
                      color: "#ff9800"
                    }}
                  />
                }
                titleTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
                title={`Reporter: ${report.reporterName}`}
                subheaderTypographyProps={{ fontSize: "0.85rem" }}
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

              <CardContent sx={{ pt: 2, pb: 2 }}>
                <Stack spacing={1.3}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Reason:
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {report.reason}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedReport && (
        <GenericModal
          open={modalOpen}
          onClose={() => !isSubmitting && setModalOpen(false)}
          title="Report Details"
          icon={
            <ReportProblemOutlinedIcon
              sx={{
                fontSize: 28,
                color: "#ff9800"
              }}
            />
          }
          primaryButtonText="Accept"
          primaryButtonIcon={<CheckCircleOutlineIcon />}
          onPrimaryAction={handleAccept}
          secondaryButtonText="Reject"
          secondaryButtonSx={{
            color: "#EF4444",
            border: "1px solid #EF4444",
            "&:hover": {
              backgroundColor: "#FEE2E2",
              borderColor: "#DC2626",
            }
          }}
          isSubmitting={isSubmitting}
          snackbar={snackbar}
          onSnackbarClose={() => setSnackbar({ ...snackbar, open: false })}
          maxWidth="sm"
        >
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
        </GenericModal>
      )}
    </Box>
  );
}