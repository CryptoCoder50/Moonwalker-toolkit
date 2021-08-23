import "styled-components";
import { MoonWalkerTheme } from "./theme";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends MoonWalkerTheme {}

}
