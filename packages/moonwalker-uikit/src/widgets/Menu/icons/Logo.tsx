import React from "react";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  const textColor = isDark ? "#FFFFFF" : "#373737";
  return (
    <Svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      enable-background="new 0 0 24 24"
      xml:space="preserve"
      {...props}
    >
      <image
        id="image0"
        width="24"
        height="24"
        x="0"
        y="0"
        xlink:href="data:image/png;base64,
      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"
      />
    </Svg>
  );
};

export default Logo;
