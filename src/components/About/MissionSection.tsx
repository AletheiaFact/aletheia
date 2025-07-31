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
import { useTranslation } from "next-i18next";

export default function MissionSection() {
  const { t } = useTranslation();

  return (
    <Box id="mission" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={t("about:missionChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold", maxWidth: 800, mx: "auto" }}>
            {t("about:missionSectionTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {t("about:missionSectionDescription")}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {[
            {
              icon: <Language sx={{ fontSize: 24 }} />,
              title: t("about:openSourcePlatformTitle"),
              description: t("about:openSourcePlatformDescription"),
            },
            {
              icon: <People sx={{ fontSize: 24 }} />,
              title: t("about:collaborativeVerificationTitle"),
              description: t("about:collaborativeVerificationDescription"),
            },
            {
              icon: <School sx={{ fontSize: 24 }} />,
              title: t("about:educationTrainingTitle"),
              description: t("about:educationTrainingDescription"),
            },
            {
              icon: <Instagram sx={{ fontSize: 24 }} />,
              title: t("about:aiPoweredDetectionTitle"),
              description: t("about:aiPoweredDetectionDescription"),
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