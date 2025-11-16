// src/pages/TrackTasks/TrackTasks.jsx

import React, { useEffect, useState } from "react";
import { Box, Container, CircularProgress } from "@mui/material";
import Header from "./components/Header";
 import Column from "./components/Column";
import { useLocation } from "react-router-dom";
import { getProjectTrackData } from "../../services/trackService";
export default function TrackTasks() {
  const location = useLocation();
  const cardData = location.state; // بيانات المشروع القادمة من الكارد
  console.log("Card Data:", cardData);

  const token = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        const res = await getProjectTrackData(token, cardData.id);
        console.log("Fetched Tasks:", res.data);
         const tasks = res.data.tasks;

        // // ترتيب التاسكات حسب الحالة
         const statuses = ["To Do", "In Progress","InReview" ,"Done"];

         const grouped = statuses.map((status) => ({
           status,
           tasks: tasks.filter((t) => t.status === status),
         }));

         setColumns(grouped);
      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [cardData.projectId]);

 return (
    <Container maxWidth="xl">
      {/* -------- Header -------- */}
      <Header cardData={cardData} />

      {/* -------- Loading State -------- */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        /* -------- Columns Layout -------- */
        <Box
          sx={{
            display: "flex",
            mt: 4,
            gap: 3,
            overflowX: "auto",
          }}
        >
          {columns.map((col) => (
            <Column
              key={col.status}
              status={col.status}
              tasks={col.tasks}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}