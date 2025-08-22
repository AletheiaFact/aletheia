import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import { ArrowUpward as ArrowForward } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../lib/umami";
import STFLogo from "./PartnerLogos/STFLogo";
import AlumiaLogo from "./PartnerLogos/AlumiaLogo";
import VerificaRSLogo from "./PartnerLogos/VerificaRSLogo";
import RNCDLogo from "./PartnerLogos/RNCDLogo";
import UNESPLogo from "./PartnerLogos/UNESPLogo";
import UFPBLogo from "./PartnerLogos/UFPBLogo";
import UFSMLogo from "./PartnerLogos/UFSMLogo";
import UBILogo from "./PartnerLogos/UBILogo";

export default function PartnersSection() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={t("about:partnersChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
            {t("about:partnersTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {t("about:partnersDescription")}
          </Typography>
        </Box>

        {/* Government Partners */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ textAlign: "center", mb: 4, fontWeight: 500 }}>
            {t("about:governmentPartnersTitle")}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} md={3}>
              <STFLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <AlumiaLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <VerificaRSLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <RNCDLogo />
            </Grid>
          </Grid>
        </Box>

        {/* University Partners */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ textAlign: "center", mb: 4, fontWeight: 500 }}>
            {t("about:universityPartnersTitle")}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} md={3}>
              <UNESPLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <UFPBLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <UFSMLogo />
            </Grid>
            <Grid item xs={6} md={3}>
              <UBILogo />
            </Grid>
          </Grid>
        </Box>

        {/* Partnership Opportunities */}
        <Box sx={{ p: 4, textAlign: "center", bgcolor: "white", border: 1, borderColor: "grey.200", borderRadius: 1 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            {t("about:partnershipOpportunitiesTitle")}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary", fontWeight: 400 }}>
            {t("about:partnershipInvitation")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: "auto", lineHeight: 1.7 }}>
            {t("about:partnershipDescription1")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: "auto", lineHeight: 1.7 }}>
            {t("about:partnershipDescription2")}
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{ bgcolor: "grey.900", "&:hover": { bgcolor: "grey.800" } }}
            href="mailto:contact@aletheiafact.org"
            component="a"
            onClick={() => trackUmamiEvent("about-partners-propose-collaboration", "contact")}
          >
            {t("about:proposeCollaboration")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}