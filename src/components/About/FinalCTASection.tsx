import React from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Stack,
} from "@mui/material";
import { ArrowUpward as ArrowForward } from "@mui/icons-material";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslations } from "next-intl";

export default function FinalCTASection() {
  const tAbout = useTranslations("about");

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontSize: { xs: "2.2rem", sm: "3.0rem", md: "3.5rem" }, mb: 2, fontWeight: "bold" }}>
          {tAbout("finalCTATitle")}
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
          {tAbout("finalCTADescription")}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
            href="/"
            component="a"
            onClick={() => trackUmamiEvent("about-final-cta-access-platform", "navigation")}
          >
            {tAbout("accessPlatform")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: "white", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            href="mailto:contact@aletheiafact.org"
            component="a"
            onClick={() => trackUmamiEvent("about-final-cta-get-training", "contact")}
          >
            {tAbout("getTraining")}
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          {tAbout("openSource")}
        </Typography>
      </Container>
    </Box>
  );
}
