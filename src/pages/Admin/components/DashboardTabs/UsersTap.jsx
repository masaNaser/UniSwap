//useMemo = حفظ نتيجة عملية حسابية وعدم إعادة حسابها إلا لما البيانات تتغير.

// المشكلة بدون useMemo:
// jsx// كل مرة Component يعمل re-render:
// const filteredUsers = users.filter(...); // 👈 تنفذ من جديد!
// يعني:

// لما تكتب حرف → re-render → filter تنفذ
// لما تضغط على أي زر → re-render → filter تنفذ
// لما أي state يتغير → re-render → filter تنفذ

// حتى لو users و searchQuery ما تغيروا! 😵


// الحل مع useMemo:
// jsxconst filteredUsers = useMemo(() => {
//   return users.filter(...);
// }, [users, searchQuery]); // 👈 بس تعيد الحساب لما هدول يتغيروا
// يعني:

// لما users يتغير → أعد الحساب ✅
// لما searchQuery يتغير → أعد الحساب ✅
// لما أي شي ثاني يتغير → استخدم النتيجة المحفوظة (ما تعيد الحساب) ⚡

import React, { useState, useEffect,useMemo  } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  EmojiEvents as PointsIcon,
} from "@mui/icons-material";
import { GetUsers } from "../../../../services/adminService";

export default function UsersTap() {
  const token = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  //هاد متغير بحفظ فيه النص اللي المستخدم بكتبه في البحث.
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await GetUsers(token);
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // فلترة المستخدمين حسب البحث
const filteredUsers = useMemo(() => {
  if (!searchQuery) return users;
  
  return users.filter(
    (user) =>
      user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.major?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [users, searchQuery]); // 👈 بس يعيد الحساب لما users أو searchQuery يتغيروا

  // دالة لاختيار لون Status
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      case "Suspended":
        return "error";
      default:
        return "default";
    }
  };

  // دالة للحصول على أول حرف من اسم المستخدم
  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header مع البحث */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Users: {users.length}
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          placeholder="Search by name, email, or major..."
          variant="outlined"
          size="small"
          value={searchQuery} //  القيمة الحالية
          onChange={(e) => setSearchQuery(e.target.value)} //  تحديث القيمة لما المستخدم يكتب
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Users Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Major</TableCell>
                <TableCell align="center">Points</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Joined Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {/* عرض النتائج المفلترة */}
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f9fafb" },
                      cursor: "pointer",
                    }}
                  >
                    {/* User Info */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: "#1976d2",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getInitials(user.userName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.userName}
                          </Typography>
                        
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                    </TableCell>

                    {/* Major */}
                    <TableCell>
                      {user.major ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <SchoolIcon sx={{ fontSize: 18, color: "#64748b" }} />
                          <Typography variant="body2">{user.major}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>

                    {/* Points */}
                    <TableCell align="center">
                      <Chip
                      
                        icon={   
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0, 75, 173, 0.84"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="8" cy="8" r="6"></circle>
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                      <path d="M7 6h1v4"></path>
                      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                    </svg>}
                        label={user.totalPoints}
                        size="medium"
                        sx={{
                          bgcolor: "#0564ff9e",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: '0.875rem', // 👈 حجم خط أكبر

                        }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell align="center">
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="medium"
                          sx={{
                          fontWeight: 600,
                          fontSize: '0.875rem', // 👈 حجم خط أكبر

                        }}
                      />
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}