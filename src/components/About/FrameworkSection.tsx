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
import { useTranslations } from "next-intl";

export default function FrameworkSection() {
  const theme = useTheme();
  const tAbout = useTranslations("about");

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={tAbout("futureVisionChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ fontSize: { xs: "2.2rem", sm: "3.0rem", md: "3.5rem" }, mb: 2, fontWeight: "bold", maxWidth: 800, mx: "auto" }}>
            {tAbout("frameworkTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {tAbout("frameworkDescription")}
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", mb: 6, color: "text.primary", maxWidth: 900, mx: "auto", lineHeight: 1.7 }}
          >
            {tAbout("frameworkIntro")}
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {[
              {
                icon: <Favorite sx={{ fontSize: 24, color: theme.palette.primary.main }} />,
                title: tAbout("socialDimensionTitle"),
                color: "primary",
                content: [
                  tAbout("socialDimensionIntro"),
                  tAbout("socialDimensionPoint1"),
                  tAbout("socialDimensionPoint2"),
                  tAbout("socialDimensionPoint3"),
                  tAbout("socialDimensionImpact"),
                ],
              },
              {
                icon: <Code sx={{ fontSize: 24, color: theme.palette.success.main }} />,
                title: tAbout("technicalDimensionTitle"),
                color: "success",
                content: [
                  tAbout("technicalDimensionIntro"),
                  tAbout("technicalDimensionPoint1"),
                  tAbout("technicalDimensionPoint2"),
                  tAbout("technicalDimensionPoint3"),
                  tAbout("technicalDimensionPoint4"),
                  tAbout("technicalDimensionImpact"),
                ],
              },
              {
                icon: <MenuBook sx={{ fontSize: 24, color: theme.palette.secondary.main }} />,
                title: tAbout("culturalDimensionTitle"),
                color: "secondary",
                content: [
                  tAbout("culturalDimensionIntro"),
                  tAbout("culturalDimensionPoint1"),
                  tAbout("culturalDimensionPoint2"),
                  tAbout("culturalDimensionPoint3"),
                  tAbout("culturalDimensionImpact"),
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
              {tAbout("replicableModelTitle")}
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  icon: <Target sx={{ fontSize: 24 }} />,
                  title: tAbout("modularTitle"),
                  desc: tAbout("modularDescription"),
                },
                {
                  icon: <Language sx={{ fontSize: 24 }} />,
                  title: tAbout("openTitle"),
                  desc: tAbout("openDescription"),
                },
                {
                  icon: <FlashOn sx={{ fontSize: 24 }} />,
                  title: tAbout("adaptableTitle"),
                  desc: tAbout("adaptableDescription"),
                },
                {
                  icon: <ArrowForward sx={{ fontSize: 24 }} />,
                  title: tAbout("scalableTitle"),
                  desc: tAbout("scalableDescription"),
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
