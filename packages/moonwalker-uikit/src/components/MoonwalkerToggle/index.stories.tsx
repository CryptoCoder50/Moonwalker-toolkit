import React, { useState } from "react";
import MoonwalkerToggle from "./MoonwalkerToggle";

export default {
  title: "Components/MoonwalkerToggle",
  component: MoonwalkerToggle,
};

export const Default: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <MoonwalkerToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <MoonwalkerToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <MoonwalkerToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
