import { darkColors, lightColors } from "../../theme/colors";
import { MoonwalkerToggleTheme } from "./types";

export const light: MoonwalkerToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: MoonwalkerToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
