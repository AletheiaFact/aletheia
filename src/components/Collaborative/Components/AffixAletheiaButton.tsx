import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface AffixAletheiaButtonProps {
  Children: React.ReactNode;
  style?: React.CSSProperties;
}

const AffixAletheiaButton: React.FC<AffixAletheiaButtonProps> = ({ Children, ...style }) => {
  const [isAffixed, setIsAffixed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawer = document.querySelector(".MuiDrawer-paper");
    const scrollTarget = drawer || window;

    const handleScroll = () => {
      if (!ref.current) return;

      const { bottom } = ref.current.getBoundingClientRect();
      const isFixed = bottom > window.innerHeight;

      if (isFixed) {
        setIsAffixed(true);
      } else {
        setIsAffixed(false);
      }
    };

    if (ref.current) {
      const scrollableSpeech = ref.current.scrollHeight > window.innerHeight;
      if (scrollableSpeech) {
        setIsAffixed(true);
      }
    }

    scrollTarget.addEventListener("scroll", handleScroll);
    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <span ref={ref} />
      <Box
        style={{
          position: isAffixed ? "fixed" : "relative",
          bottom: isAffixed ? 15 : "auto",
          ...style,
        }}
      >
        {Children}
      </Box>
    </>
  );
};

export default AffixAletheiaButton;
