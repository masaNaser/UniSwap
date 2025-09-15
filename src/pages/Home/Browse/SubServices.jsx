import React from "react";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    Breadcrumbs,
} from "@mui/material";
import CustomButton from '../../../components/CustomButton/CustomButton';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ServiceCard from "../../../components/Cards/ServiceCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Mock data to simulate fetching data for different categories
const mockData = {
    "design-creative": {
        name: "Design & Creative",
        description: "Visual design, graphics, UI/UX, and creative services",
        subcategories: [
            {
                title: "Graphic Design",
                count: 89,
                url: "/services/graphic-design",
            },
            {
                title: "UI/UX Design",
                count: 87,
                url: "/services/ui-ux-design",
            },
            {
                title: "Motion Graphics",
                count: 34,
                url: "/services/motion-graphics",
            },
            {
                title: "Branding & Identity",
                count: 28,
                url: "/services/branding-identity",
            },
            {
                title: "Illustration",
                count: 27,
                url: "/services/illustration",
            },
        ],
    },
    "programming-tech": {
        name: "Programming & Tech",
        description: "Web development, mobile apps, and software solutions",
        subcategories: [
            {
                title: "Web Development",
                count: 110,
                url: "/services/web-development",
            },
            {
                title: "Mobile Apps",
                count: 55,
                url: "/services/mobile-apps",
            },
            {
                title: "Data Science",
                count: 24,
                url: "/services/data-science",
            },
        ],
    },
    "writing-translation": {
        name: "Writing & Translation",
        description: "Content writing, copywriting, and translation services",
        subcategories: [
            {
                title: "Content Writing",
                count: 70,
                url: "/services/content-writing",
            },
            {
                title: "Copywriting",
                count: 50,
                url: "/services/copywriting",
            },
            {
                title: "Translation",
                count: 36,
                url: "/services/translation",
            },
        ],
    },
    "study-support": {
        name: "Study Support",
        description: "Tutoring, exam prep, and academic assistance",
        subcategories: [
            {
                title: "Tutoring",
                count: 65,
                url: "/services/tutoring",
            },
            {
                title: "Exam Prep",
                count: 45,
                url: "/services/exam-prep",
            },
            {
                title: "Proofreading",
                count: 24,
                url: "/services/proofreading",
            },
        ],
    },
    "career-business": {
        name: "Career & Business",
        description: "Resume writing, interview prep, and business consulting",
        subcategories: [
            {
                title: "Resume Writing",
                count: 40,
                url: "/services/resume-writing",
            },
            {
                title: "Interview Prep",
                count: 30,
                url: "/services/interview-prep",
            },
            {
                title: "Consulting",
                count: 28,
                url: "/services/consulting",
            },
        ],
    },
    "personal-development": {
        name: "Personal Development",
        description: "Life coaching, skill development, and wellness",
        subcategories: [
            {
                title: "Life Coaching",
                count: 25,
                url: "/services/life-coaching",
            },
            {
                title: "Skill Development",
                count: 20,
                url: "/services/skill-development",
            },
            {
                title: "Wellness",
                count: 15,
                url: "/services/wellness",
            },
        ],
    },
};

const SubServices = () => {
    const { categoryName } = useParams();

    // Find the category data based on the URL parameter
    const categoryData = mockData[categoryName];

    if (!categoryData) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5" color="error">
                    Category not found!
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 2 }}
            >
                <Typography
                    component={Link}
                    to="/browse"
                    color="inherit"
                    sx={{ textDecoration: "none" }}
                >
                    Services
                </Typography>
                <Typography color="text.primary">{categoryData.name}</Typography>
            </Breadcrumbs>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {categoryData.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {categoryData.description}
                    </Typography>
                </Box>
                <CustomButton
                    component={Link}
                    to="/browse"
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </CustomButton>
            </Box>

            <Grid container spacing={3}>
                {categoryData.subcategories.map((subcat) => (
                    <Grid item xs={12} sm={6} md={4} key={subcat.title}>
                        <ServiceCard
                            title={subcat.title}
                            count={subcat.count}
                            url={subcat.url}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SubServices;
