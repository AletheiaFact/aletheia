import React from "react";
import { Box } from "@mui/material";

import HeroSection from "./HeroSection";
import MissionSection from "./MissionSection";
import FrameworkSection from "./FrameworkSection";
import ImpactSection from "./ImpactSection";
import PartnersSection from "./PartnersSection";
import AwardsSection from "./AwardsSection";
import ResourcesSection from "./ResourcesSection";
import FinalCTASection from "./FinalCTASection";

export default function About() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <HeroSection />
      <MissionSection />
      <FrameworkSection />
      <ImpactSection />
      <PartnersSection />
      <AwardsSection />
      <ResourcesSection />
      <FinalCTASection />
    </Box>
  );
}