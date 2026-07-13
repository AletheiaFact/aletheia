import React from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  Box,
  Chip,
  CardContent,
} from "@mui/material";
import {
  People,
  Language,
  School,
  Instagram,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";

export default function MissionSection() {
  const tAbout = useTranslations("about");

  return (
    <Box id="mission" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={tAbout("missionChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ fontSize: { xs: "2.2rem", sm: "3.0rem", md: "3.5rem" }, mb: 2, fontWeight: "bold", maxWidth: 800, mx: "auto" }}>
            {tAbout("missionSectionTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {tAbout("missionSectionDescription")}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {[
            {
              icon: <Language sx={{ fontSize: 24 }} />,
              title: tAbout("openSourcePlatformTitle"),
              description: tAbout("openSourcePlatformDescription"),
            },
            {
              icon: <People sx={{ fontSize: 24 }} />,
              title: tAbout("collaborativeVerificationTitle"),
              description: tAbout("collaborativeVerificationDescription"),
            },
            {
              icon: <School sx={{ fontSize: 24 }} />,
              title: tAbout("educationTrainingTitle"),
              description: tAbout("educationTrainingDescription"),
            },
            {
              icon: <Instagram sx={{ fontSize: 24 }} />,
              title: tAbout("aiPoweredDetectionTitle"),
              description: tAbout("aiPoweredDetectionDescription"),
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  border: 1,
                  borderColor: "grey.200",
                  boxShadow: 1,
                  "&:hover": { boxShadow: 3 },
                  minHeight: 280,
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "grey.700",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, flexGrow: 1 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
