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
import { getToken } from "../../../../utils/authHelpers";
export default function ReportsTab({ onReportReviewed,highlightedReportId  }) {
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

 const [hasOpenedHighlightedReport, setHasOpenedHighlightedReport] = useState(false);

useEffect(() => {
  if (highlightedReportId && reports.length > 0 && !hasOpenedHighlightedReport) {
    fetchReportById(highlightedReportId);
    setHasOpenedHighlightedReport(true); // ✅ علّم إنك فتحت الـ modal
  }
}, [highlightedReportId, reports, hasOpenedHighlightedReport]);

  // جلب التقارير المعلقة
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

// جلب تقرير واحد بالتفصيل
  const fetchReportById = async (id) => {
    try {
      const { data } = await GetOneReports(token, id);
      setSelectedReport(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
// قبول التقرير
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
// رفض التقرير
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

// جلب التقارير المعلقة عند التحميل
  useEffect(() => {
    fetchPendingReports();
  }, []);

// عرض حالة التحميل أو عدم وجود تقارير
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress size={45} />
      </Box>
    );
// لا توجد تقارير معلقة
  if (reports.length === 0)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          No pending Reports
        </Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: { xs: "center", sm: "flex-start" }
        }}
      >
        {reports.map((report) => (
          <Card
            key={report.id}
            sx={{
              width: 346,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
              transition: "0.25s",
              position: "relative",
              overflow: "hidden",
              pr: 4,
              ":hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)"
              },
                // 🔥 highlight للـ report المحدد
                // border: highlightedReportId === report.id 
                //   ? "3px solid #00C8FF" 
                //   : "none",
                // ":hover": { transform: "scale(1.02)", boxShadow: 4 },
              cursor: "pointer",
              
            }}
            onClick={() => fetchReportById(report.id)}
          >
            {/* Pending Chip positioned at top */}
            <Box sx={{ p: 2, pb: 1 }}>
              <Chip
                label={report.status}
                size="small"
                sx={{
                  bgcolor: "#FEF3C7",
                  color: "#F59E0B",
                  fontWeight: 600,
                  fontSize: "12px",
                  height: "26px",
                  px: 1.5,
                  mb: 2,
                  borderRadius: "6px",
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

            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Stack spacing={1.3}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Reason:
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.5,
                    minHeight: "3em", // 2 lines × 1.5 line-height
                  }}
                >
                  {report.reason}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

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
            onSecondaryAction={handleReject}
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