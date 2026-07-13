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
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslations } from "next-intl";

export default function AwardsSection() {
  const tAbout = useTranslations("about");

  return (
    <Box id="awards-section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label={tAbout("awardsChip")} sx={{ mb: 2, bgcolor: "grey.100" }} />
          <Typography variant="h3" sx={{ fontSize: { xs: "2.2rem", sm: "3.0rem", md: "3.5rem" }, mb: 2, fontWeight: "bold" }}>
            {tAbout("awardsTitle")}
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontWeight: 400 }}>
            {tAbout("awardsDescription")}
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
          <Chip label={tAbout("wsisNomination")} sx={{ mb: 2, bgcolor: "primary.main", color: "white" }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            {tAbout("wsisTitle")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", lineHeight: 1.7 }}>
            {tAbout("wsisDescription")}
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
              {tAbout("learnAboutWSIS")}
            </Button>
            <Button
              variant="outlined"
              href="https://sustainabledevelopment.un.org/index.php?page=view&type=30022&nr=102&menu=3170"
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackUmamiEvent("about-awards-view-nomination", "external_link")}
            >
              {tAbout("viewNomination")}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
