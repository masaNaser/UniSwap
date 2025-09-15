import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import SelectActionCard from "../../../components/Cards/Cards";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CodeIcon from "@mui/icons-material/Code";
import TranslateIcon from "@mui/icons-material/Translate";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const categories = [
    {
        title: "Design & Creative",
        description: "Visual design, graphics, UI/UX, and creative services",
        count: 245,
        icon: <DesignServicesIcon fontSize="large" sx={{ color: "#6A67FE" }} />,
        url: "/browse/design-creative",
    },
    {
        title: "Programming & Tech",
        description: "Web development, mobile apps, and software solutions",
        count: 189,
        icon: <CodeIcon fontSize="large" sx={{ color: "#00C853" }} />,
        url: "/browse/programming-tech",
    },
    {
        title: "Writing & Translation",
        description: "Content writing, copywriting, and translation services",
        count: 156,
        icon: <TranslateIcon fontSize="large" sx={{ color: "#FF9800" }} />,
        url: "/browse/writing-translation",
    },
    {
        title: "Study Support",
        description: "Tutoring, exam prep, and academic assistance",
        count: 134,
        icon: <SchoolIcon fontSize="large" sx={{ color: "#2196F3" }} />,
        url: "/browse/study-support",
    },
    {
        title: "Career & Business",
        description: "Resume writing, interview prep, and business consulting",
        count: 98,
        icon: <BusinessCenterIcon fontSize="large" sx={{ color: "#FF5722" }} />,
        url: "/browse/career-business",
    },
    {
        title: "Personal Development",
        description: "Life coaching, skill development, and wellness",
        count: 76,
        icon: <SelfImprovementIcon fontSize="large" sx={{ color: "#9C27B0" }} />,
        url: "/browse/personal-development",
    },
];

const Services = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "1rem" }}>
                Services
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Service Marketplace
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Find the perfect service for your needs
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {categories.map((cat) => (
                    <Grid item xs={12} sm={6} md={4} key={cat.title}>
                        <SelectActionCard
                            icon={cat.icon}
                            title={cat.title}
                            description={cat.description}
                            count={cat.count}
                            url={cat.url}
                        />
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
};

export default Services;
