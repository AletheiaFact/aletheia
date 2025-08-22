import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Check,
  ArrowUpward as ArrowForward,
  Download,
} from "@mui/icons-material";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";

export default function HeroSection() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={6} alignItems="center" sx={{ minHeight: { md: "70vh" } }}>
        <Grid item xs={12} lg={6}>
          <Stack spacing={4}>
            <Box>
              <Chip
                label={t("about:heroChip")}
                sx={{ mb: 3, bgcolor: "grey.100", color: "text.secondary" }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                  fontWeight: 300,
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                {t("about:heroTitle")}
                <Typography
                  component="span"
                  variant="h1"
                  sx={{
                    display: "block",
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                    fontWeight: 500,
                  }}
                >
                  {t("about:heroTitleHighlight")}
                </Typography>
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 600, mb: 4, lineHeight: 1.6 }}>
                {t("about:heroDescription")}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{ bgcolor: "grey.900", "&:hover": { bgcolor: "grey.800" }, px: 3, py: 1.5 }}
                href="/"
                component="a"
                onClick={() => trackUmamiEvent("about-hero-access-platform", "navigation")}
              >
                {t("about:accessPlatform")}
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<Download />} 
                sx={{ px: 3, py: 1.5 }}
                href="/supportive-materials"
                component="a"
                onClick={() => trackUmamiEvent("about-hero-download-manual", "download")}
              >
                {t("about:downloadManual")}
              </Button>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ color: "text.secondary" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                <Typography variant="body2">{t("about:openSource")}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                <Typography variant="body2">{t("about:creativeCommons")}</Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box sx={{ position: "relative", maxWidth: 600, mx: "auto" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                borderRadius: 3,
                filter: "blur(40px)",
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: 400,
                borderRadius: 3,
                boxShadow: theme.shadows[12],
                border: 1,
                borderColor: "grey.200",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/kanban_about.jpeg"
                alt="Kanban Platform Screenshot"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}