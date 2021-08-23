import React from "react";
import { MoonwalkerStack, MoonwalkerInput, MoonwalkerLabel } from "./StyledMoonwalkerToggle";
import { MoonwalkerToggleProps, scales } from "./types";

const MoonwalkerToggle: React.FC<MoonwalkerToggleProps> = ({ checked, scale = scales.LG, ...props }) => (
  <MoonwalkerStack scale={scale}>
    <MoonwalkerInput id={props.id || "moonwalker-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <MoonwalkerLabel scale={scale} checked={checked} htmlFor={props.id || "moonwalker-toggle"}>
      <div className="moonwalkers">
        <div className="moonwalker" />
        <div className="moonwalker" />
        <div className="moonwalker" />
        <div className="butter" />
      </div>
    </MoonwalkerLabel>
  </MoonwalkerStack>
);

export default MoonwalkerToggle;
