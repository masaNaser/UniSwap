import { Box, Typography, Chip } from "@mui/material";
import { useProfile } from "../../Context/ProfileContext";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function ProfileInfo() {
  const { userData } = useProfile();

  const getFirstName = (userName) => {
    return userName?.match(/^[A-Z][a-z]*/)?.[0] || userName;
  };

  // Function to detect platform from URL
  const detectPlatform = (url) => {
    if (!url) return 'website';
    const urlLower = url.toLowerCase();
    if (urlLower.includes('github.com')) return 'github';
    if (urlLower.includes('linkedin.com')) return 'linkedin';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    if (urlLower.includes('facebook.com')) return 'facebook';
    if (urlLower.includes('mailto:') || urlLower.includes('@')) return 'email';
    return 'website';
  };

  // Function to get icon based on platform
  const getSocialIcon = (platform) => {
    const iconStyle = { fontSize: 20, color: "rgba(0, 0, 0, 0.6)" };
    
    switch (platform) {
      case 'email':
        return <EmailOutlinedIcon sx={iconStyle} />;
      case 'github':
        return <GitHubIcon sx={iconStyle} />;
      case 'linkedin':
        return <LinkedInIcon sx={iconStyle} />;
      case 'twitter':
        return <TwitterIcon sx={iconStyle} />;
      case 'facebook':
        return <FacebookIcon sx={iconStyle} />;
      default:
        return <LanguageIcon sx={iconStyle} />;
    }
  };

  // Parse and render social links
  const renderSocialLinks = () => {
    // Check if socialLinks exists and is an array with items
    if (!userData.socialLinks || !Array.isArray(userData.socialLinks) || userData.socialLinks.length === 0) {
      return (
        <Typography sx={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "14px" }}>
          No contact info
        </Typography>
      );
    }

    return userData.socialLinks.map((link, index) => {
      if (!link || link.trim() === '') return null;

      const platform = detectPlatform(link);
      const isEmail = platform === 'email';
      const href = isEmail && !link.startsWith('mailto:') 
        ? `mailto:${link}` 
        : link.startsWith('http') ? link : `https://${link}`;

      return (
        <Box
          key={index}
          component="a"
          href={href}
          target={isEmail ? undefined : "_blank"}
          rel="noopener noreferrer"
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            backgroundColor: "rgba(241, 245, 249, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            textDecoration: "none",
            "&:hover": {
              backgroundColor: "rgba(226, 232, 240, 1)",
            },
          }}
        >
          {getSocialIcon(platform)}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        mt: 4,
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      {/* About Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          About {getFirstName(userData.userName)}
        </Typography>
        <Typography sx={{ color: "rgba(0, 0, 0, 0.7)", lineHeight: 1.6 }}>
          {userData.bio || "No bio available yet."}
        </Typography>
      </Box>

   {/* Info Grid */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
    gap: 2,
    mt: 3,
  }}
>
  {/* Response Time */}
  <Box 
    sx={{
      background: "rgba(241, 245, 249, 1)",
      p: 2.5,
      borderRadius: "12px",
      border: "1px solid rgba(226, 232, 240, 1)",
      transition: "all 0.2s",
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }
    }}
  >
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: "13px",
        mb: 1.5,
        color: "rgba(71, 85, 105, 1)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      Response Time
    </Typography>
    <Typography
      sx={{
        color: "rgba(5, 150, 105, 1)",
        fontWeight: 700,
        fontSize: "20px",
      }}
    >
      &lt; 2 hours
    </Typography>
  </Box>

  {/* Skills */}
  <Box 
    sx={{
      background: "rgba(241, 245, 249, 1)",
      p: 2.5,
      borderRadius: "12px",
      border: "1px solid rgba(226, 232, 240, 1)",
      transition: "all 0.2s",
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }
    }}
  >
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: "13px",
        mb: 1.5,
        color: "rgba(71, 85, 105, 1)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      Skills
    </Typography>
    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
      {userData.skills && userData.skills.length > 0 ? (
        userData.skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "rgba(51, 65, 85, 1)",
              fontWeight: 500,
              fontSize: "12px",
              border: "1px solid rgba(226, 232, 240, 1)",
              "&:hover": {
                backgroundColor: "rgba(248, 250, 252, 1)",
              }
            }}
          />
        ))
      ) : (
        <Typography sx={{ color: "rgba(100, 116, 139, 1)", fontSize: "13px" }}>
          No skills added
        </Typography>
      )}
    </Box>
  </Box>

  {/* Contact */}
  <Box 
    sx={{
      background: "rgba(241, 245, 249, 1)",
      p: 2.5,
      borderRadius: "12px",
      border: "1px solid rgba(226, 232, 240, 1)",
      transition: "all 0.2s",
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }
    }}
  >
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: "13px",
        mb: 1.5,
        color: "rgba(71, 85, 105, 1)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      Contact
    </Typography>
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
      {renderSocialLinks()}
    </Box>
  </Box>
</Box>
    </Box>
  );
}