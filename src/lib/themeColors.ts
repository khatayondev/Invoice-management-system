// Default color palettes for each template
export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
}

const DEFAULTS: Record<string, ThemeColors> = {
  CLASSIC: {
    primaryColor: '#111827',   // Gray-900
    secondaryColor: '#6B7280', // Gray-500
    bgColor: '#FFFFFF',
  },
  MODERN: {
    primaryColor: '#1E40AF',   // Blue-800
    secondaryColor: '#3B82F6', // Blue-500
    bgColor: '#FFFFFF',
  },
  MINIMAL: {
    primaryColor: '#000000',
    secondaryColor: '#999999',
    bgColor: '#FFFFFF',
  },
  PROFESSIONAL: {
    primaryColor: '#0F172A',   // Slate-900
    secondaryColor: '#64748B', // Slate-500
    bgColor: '#FAFAFA',
  },
};

/**
 * Get merged theme colors for a given template.
 * User overrides (from the themeColors JSON string) take precedence over defaults.
 */
export function getThemeColors(pdfTheme: string, themeColorsData?: string | any | null): ThemeColors {
  const defaults = DEFAULTS[pdfTheme] || DEFAULTS.CLASSIC;

  if (!themeColorsData) return defaults;

  try {
    const overrides = typeof themeColorsData === 'string' ? JSON.parse(themeColorsData) : themeColorsData;
    return {
      primaryColor: overrides.primaryColor || defaults.primaryColor,
      secondaryColor: overrides.secondaryColor || defaults.secondaryColor,
      bgColor: overrides.bgColor || defaults.bgColor,
    };
  } catch {
    return defaults;
  }
}

/** Get default colors for a given template (no overrides). */
export function getDefaultColors(pdfTheme: string): ThemeColors {
  return DEFAULTS[pdfTheme] || DEFAULTS.CLASSIC;
}

/** Preset color palettes users can pick from */
export const COLOR_PRESETS: { name: string; colors: ThemeColors }[] = [
  { name: 'Ocean Blue', colors: { primaryColor: '#1E40AF', secondaryColor: '#3B82F6', bgColor: '#FFFFFF' } },
  { name: 'Forest Green', colors: { primaryColor: '#166534', secondaryColor: '#22C55E', bgColor: '#FFFFFF' } },
  { name: 'Royal Purple', colors: { primaryColor: '#6B21A8', secondaryColor: '#A855F7', bgColor: '#FFFFFF' } },
  { name: 'Sunset Orange', colors: { primaryColor: '#C2410C', secondaryColor: '#F97316', bgColor: '#FFFFFF' } },
  { name: 'Crimson Red', colors: { primaryColor: '#991B1B', secondaryColor: '#EF4444', bgColor: '#FFFFFF' } },
  { name: 'Midnight', colors: { primaryColor: '#1E293B', secondaryColor: '#475569', bgColor: '#F8FAFC' } },
  { name: 'Rose Gold', colors: { primaryColor: '#9F1239', secondaryColor: '#FB7185', bgColor: '#FFF1F2' } },
  { name: 'Teal', colors: { primaryColor: '#115E59', secondaryColor: '#14B8A6', bgColor: '#FFFFFF' } },
];
