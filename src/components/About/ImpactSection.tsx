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
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

export default function ImpactSection() {
  const { t } = useTranslation();

  return (
    <Box id="impact" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={t("about:impactChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
            {t("about:impactTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {t("about:impactDescription")}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            {
              number: "600+",
              title: t("about:trainedAgents"),
              desc: t("about:trainedAgentsDescription"),
              color: "primary.main",
            },
            {
              number: "20+",
              title: t("about:partnerUniversities"),
              desc: t("about:partnerUniversitiesDescription"),
              color: "success.main",
            },
            {
              number: "UN",
              title: t("about:internationalRecognition"),
              desc: t("about:internationalRecognitionDescription"),
              color: "secondary.main",
            },
            {
              number: "🌍",
              title: t("about:crossBorderPartnerships"),
              desc: t("about:crossBorderPartnershipsDescription"),
              color: "warning.main",
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ textAlign: "center", height: "100%", border: 1, borderColor: "grey.200" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h2" sx={{ color: stat.color, fontWeight: "bold", mb: 1, fontSize: "2.5rem" }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {stat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{ bgcolor: "grey.900", "&:hover": { bgcolor: "grey.800" } }}
            href="/supportive-materials"
            component="a"
            target="_blank"
          >
            {t("about:downloadReports")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}