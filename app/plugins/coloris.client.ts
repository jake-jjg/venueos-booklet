import Coloris from "@melloware/coloris";
import "@melloware/coloris/dist/coloris.css";

export default defineNuxtPlugin(() => {
  Coloris.init();
  Coloris({
    theme: "polaroid",
    format: "hex",
    formatToggle: true,
    alpha: false,
    focusInput: true,
    closeButton: true,
    closeLabel: "Done",
  });
});
