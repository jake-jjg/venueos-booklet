export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  background: "#ffffff",
};

// HSL → hex helper
function hslToHex(h: number, s: number, l: number): string {
  const lN = l / 100;
  const sN = s / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const toChannel = (n: number): string => {
    const k = (n + h / 30) % 12;
    const value = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${toChannel(0)}${toChannel(8)}${toChannel(4)}`;
}

// hex → HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const LIGHTNESS_TARGETS = [97, 93, 86, 75, 63, 52, 42, 33, 24, 15, 9];
const SATURATION_MULTIPLIERS = [
  0.15, 0.25, 0.45, 0.65, 0.85, 1.0, 1.0, 0.95, 0.85, 0.75, 0.65,
];

export function generateColorScale(hex: string): Record<number, string> {
  const { h, s } = hexToHsl(hex);
  return Object.fromEntries(
    SHADES.map((shade, i) => [
      shade,
      hslToHex(
        h,
        Math.min(100, s * SATURATION_MULTIPLIERS[i]!),
        LIGHTNESS_TARGETS[i]!,
      ),
    ]),
  );
}

export const useTheme = () => {
  const supabase = useSupabaseClient();
  const config = useRuntimeConfig();

  const themeReady = useState("theme_ready", () => false);

  const colors = useState<ThemeColors>("theme_colors", () => ({
    ...DEFAULT_THEME_COLORS,
  }));
  const loading = useState("theme_loading", () => false);

  const applyTheme = (themeColors: ThemeColors) => {
    colors.value = { ...themeColors };

    if (!import.meta.client) return;

    const root = document.documentElement;
    const primaryScale = generateColorScale(themeColors.primary);
    const secondaryScale = generateColorScale(themeColors.secondary);

    for (const [step, value] of Object.entries(primaryScale)) {
      root.style.setProperty(`--color-primary-${step}`, value);
    }
    for (const [step, value] of Object.entries(secondaryScale)) {
      root.style.setProperty(`--color-secondary-${step}`, value);
    }

    root.style.setProperty("--color-background", themeColors.background);
    root.style.setProperty("--ui-primary", primaryScale[500]!);
    root.style.setProperty("--ui-secondary", secondaryScale[500]!);
  };

  const fetchTheme = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("theme")
        .eq("id", config.public.venueId)
        .single();

      if (error || !data?.theme) return;

      applyTheme({
        ...DEFAULT_THEME_COLORS,
        ...(data.theme as Partial<ThemeColors>),
      });
    } catch {
      // Column may not exist yet — fall back to defaults silently
    } finally {
      themeReady.value = true;
    }
  };

  const saveTheme = async (
    newColors: ThemeColors,
  ): Promise<{ error: Error | null }> => {
    loading.value = true;
    try {
      const { error } = await supabase
        .from("venues")
        .update({ theme: newColors })
        .eq("id", config.public.venueId);

      if (error) return { error: new Error(error.message) };

      applyTheme(newColors);
      return { error: null };
    } catch (e) {
      return { error: e as Error };
    } finally {
      loading.value = false;
    }
  };

  return {
    colors,
    loading,
    themeReady,
    applyTheme,
    fetchTheme,
    saveTheme,
    generateColorScale,
  };
};
