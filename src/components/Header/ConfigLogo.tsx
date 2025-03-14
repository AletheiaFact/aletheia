import React from "react"
import Image from "next/image"

const ConfigLogo = ({
  height = "",
  width = "",
}: {
  height?: string;
  width?: string;
}) => {
  return (
    <Image
      alt="logo"
      src="/images/default_logo.svg"
      height={height}
      width={width}
    />
  )
}

export default ConfigLogo;
