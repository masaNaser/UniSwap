import React, { useState, useEffect } from "react";
import { GetPendingReports } from "../../../../services/adminService";

export default function ReportsTap() {
    const token = localStorage.getItem("accessToken");

    const fetchAnalytics = async () => {
      try {
        const { data } = await GetPendingReports(token,);
        // setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      fetchAnalytics();
    }, []);
  return (
    <div>TapReports</div>
  )
}

