import React from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Chip,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import { Star, ArrowUpward as ArrowForward } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";

export default function AwardsSection() {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={t("about:awardsChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
            {t("about:awardsTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {t("about:awardsDescription")}
          </Typography>
        </Box>

        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            background: "linear-gradient(135deg, #E3F2FD 0%, #C5CAE9 100%)",
            border: "2px solid",
            borderColor: "primary.light",
            maxWidth: 700,
            mx: "auto",
          }}
        >
          <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", mx: "auto", mb: 3 }}>
            <Star sx={{ fontSize: 32 }} />
          </Avatar>
          <Chip label={t("about:wsisNomination")} sx={{ mb: 2, bgcolor: "primary.main", color: "white" }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            {t("about:wsisTitle")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", lineHeight: 1.7 }}>
            {t("about:wsisDescription")}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              endIcon={<ArrowForward />}
              href="https://www.itu.int/net4/wsis/forum/2025/"
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackUmamiEvent("about-awards-learn-wsis", "external_link")}
            >
              {t("about:learnAboutWSIS")}
            </Button>
            <Button 
              variant="outlined"
              href="https://sustainabledevelopment.un.org/index.php?page=view&type=30022&nr=102&menu=3170"
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackUmamiEvent("about-awards-view-nomination", "external_link")}
            >
              {t("about:viewNomination")}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}