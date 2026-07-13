import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  Box,
  Chip,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  Download,
  Info as Description,
  School,
  Language,
} from "@mui/icons-material";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslations } from "next-intl";

export default function ResourcesSection() {
  const theme = useTheme();
  const tAbout = useTranslations("about");

  return (
    <Box id="resources" sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={tAbout("resourcesChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ fontSize: { xs: "2.2rem", sm: "3.0rem", md: "3.5rem" }, mb: 2, fontWeight: "bold" }}>
            {tAbout("resourcesTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {tAbout("resourcesDescription")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            maxWidth: { xs: "100%", md: 900 },
            mx: "auto",
            px: { xs: 1, md: 0 },
          }}
        >
          {[
            {
              icon: <Description sx={{ fontSize: { xs: 32, md: 40 }, color: theme.palette.primary.main }} />,
              title: tAbout("methodologyGuideTitle"),
              description: tAbout("methodologyGuideDescription"),
              color: "primary",
            },
            {
              icon: <School sx={{ fontSize: { xs: 32, md: 40 }, color: theme.palette.success.main }} />,
              title: tAbout("educationalToolkitTitle"),
              description: tAbout("educationalToolkitDescription"),
              color: "success",
            },
            {
              icon: <Language sx={{ fontSize: { xs: 32, md: 40 }, color: theme.palette.secondary.main }} />,
              title: tAbout("platformDocumentationTitle"),
              description: tAbout("platformDocumentationDescription"),
              color: "secondary",
            },
          ].map((resource, index) => (
            <Card
              key={index}
              sx={{
                flex: { xs: "none", md: 1 },
                minWidth: 0,
                border: 2,
                borderColor: `${resource.color}.light`,
                "&:hover": { borderColor: `${resource.color}.main` },
                transition: "border-color 0.3s",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{ mb: { xs: 2, md: 3 } }}>{resource.icon}</Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {resource.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6, flexGrow: 1 }}>
                  {resource.description}
                </Typography>
                <Button
                  variant={index === 0 ? "contained" : "outlined"}
                  startIcon={<Download />}
                  fullWidth
                  sx={index === 0 ? { bgcolor: "grey.900", "&:hover": { bgcolor: "grey.800" } } : {}}
                  href={index === 0 ? "/supportive-materials" : index === 1 ? "/supportive-materials" : "https://docs.aletheiafact.org/"}
                  component="a"
                  target={index === 2 ? "_blank" : undefined}
                  rel={index === 2 ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    const eventNames = ["about-download-methodology", "about-download-toolkit", "about-access-docs"];
                    const eventGroups = ["download", "download", "navigation"];
                    trackUmamiEvent(eventNames[index], eventGroups[index]);
                  }}
                >
                  {index === 0 ? tAbout("downloadPDF") : index === 1 ? tAbout("downloadKit") : tAbout("accessDocs")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
