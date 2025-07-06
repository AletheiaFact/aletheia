import React from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  Box,
  Chip,
  Paper,
  Stack,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  MenuBook,
  Language,
  ArrowUpward as ArrowForward,
  GpsFixed as Target,
  FlashAuto as FlashOn,
  Favorite,
  Code,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";

export default function FrameworkSection() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={t("about:futureVisionChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold", maxWidth: 800, mx: "auto" }}>
            {t("about:frameworkTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {t("about:frameworkDescription")}
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", mb: 6, color: "text.primary", maxWidth: 900, mx: "auto", lineHeight: 1.7 }}
          >
            {t("about:frameworkIntro")}
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {[
              {
                icon: <Favorite sx={{ fontSize: 24, color: theme.palette.primary.main }} />,
                title: t("about:socialDimensionTitle"),
                color: "primary",
                content: [
                  t("about:socialDimensionIntro"),
                  t("about:socialDimensionPoint1"),
                  t("about:socialDimensionPoint2"),
                  t("about:socialDimensionPoint3"),
                  t("about:socialDimensionImpact"),
                ],
              },
              {
                icon: <Code sx={{ fontSize: 24, color: theme.palette.success.main }} />,
                title: t("about:technicalDimensionTitle"),
                color: "success",
                content: [
                  t("about:technicalDimensionIntro"),
                  t("about:technicalDimensionPoint1"),
                  t("about:technicalDimensionPoint2"),
                  t("about:technicalDimensionPoint3"),
                  t("about:technicalDimensionPoint4"),
                  t("about:technicalDimensionImpact"),
                ],
              },
              {
                icon: <MenuBook sx={{ fontSize: 24, color: theme.palette.secondary.main }} />,
                title: t("about:culturalDimensionTitle"),
                color: "secondary",
                content: [
                  t("about:culturalDimensionIntro"),
                  t("about:culturalDimensionPoint1"),
                  t("about:culturalDimensionPoint2"),
                  t("about:culturalDimensionPoint3"),
                  t("about:culturalDimensionImpact"),
                ],
              },
            ].map((dimension, index) => (
              <Grid item xs={12} lg={4} key={index}>
                <Card sx={{ height: "100%", border: 1, borderColor: "grey.200" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${dimension.color}.50`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      {dimension.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, fontSize: "1.1rem" }}>
                      {dimension.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {dimension.content.map((text, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            color: idx === 0 || text.startsWith("Impact:") ? "text.primary" : "text.secondary",
                            fontWeight: text.startsWith("Impact:") ? 500 : "normal",
                            lineHeight: 1.6,
                            fontSize: text.startsWith("Impact:") ? "0.9rem" : "0.875rem",
                          }}
                        >
                          {text.startsWith("Impact:") ? text : idx === 0 ? text : `• ${text}`}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Highlight Box */}
          <Paper
            sx={{
              mt: 6,
              p: 4,
              background: "linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%)",
              border: "2px solid",
              borderColor: "warning.light",
            }}
          >
            <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}>
              {t("about:replicableModelTitle")}
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  icon: <Target sx={{ fontSize: 24 }} />,
                  title: t("about:modularTitle"),
                  desc: t("about:modularDescription"),
                },
                {
                  icon: <Language sx={{ fontSize: 24 }} />,
                  title: t("about:openTitle"),
                  desc: t("about:openDescription"),
                },
                {
                  icon: <FlashOn sx={{ fontSize: 24 }} />,
                  title: t("about:adaptableTitle"),
                  desc: t("about:adaptableDescription"),
                },
                {
                  icon: <ArrowForward sx={{ fontSize: 24 }} />,
                  title: t("about:scalableTitle"),
                  desc: t("about:scalableDescription"),
                },
              ].map((item, idx) => (
                <Grid item xs={6} md={3} key={idx} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "warning.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      color: "warning.dark",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.desc}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}