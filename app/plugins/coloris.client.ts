import Coloris from "@melloware/coloris";
import "@melloware/coloris/dist/coloris.css";

export default defineNuxtPlugin(() => {
  Coloris.init();
  Coloris({
    themeMode: "auto",
    format: "hex",
    alpha: false,
    focusInput: true,
    closeButton: true,
    closeLabel: "Done",
  });
});
