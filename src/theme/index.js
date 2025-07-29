// MoodGenius Design System Theme
// Modern UI foundation with wellness-focused color palette

export const colors = {
  // Primary wellness greens
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7', 
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80', // Main wellness green
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Calming blues for secondary actions
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main calming blue
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Warm colors for mood indicators
  mood: {
    // Negative moods - warm reds/oranges
    awful: '#EF4444',      // Red-500
    bad: '#F97316',        // Orange-500  
    meh: '#6B7280',        // Gray-500
    good: '#10B981',       // Emerald-500
    great: '#22C55E',      // Green-500
  },
  
  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
  },
  
  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xl2: 24,
    xl3: 30,
    xl4: 36,
    xl5: 48,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Font families (can be extended with custom fonts)
  fontFamily: {
    body: 'System',
    heading: 'System',
    mono: 'Menlo',
  },
};

export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Component variants for consistent styling
export const variants = {
  button: {
    primary: {
      backgroundColor: colors.primary[400],
      color: colors.text.inverse,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
      ...shadows.base,
    },
    secondary: {
      backgroundColor: colors.secondary[400],
      color: colors.text.inverse, 
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
      ...shadows.base,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[400],
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.primary[400],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[400],
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
    },
  },
  
  card: {
    default: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.xl2,
      padding: spacing[6],
      margin: spacing[4],
      ...shadows.lg,
    },
    elevated: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.xl2,
      padding: spacing[6],
      margin: spacing[4],
      ...shadows.xl,
    },
    flat: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.xl2,
      padding: spacing[6],
      margin: spacing[4],
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
  },
  
  input: {
    default: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing[4],
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      borderWidth: 2,
      borderColor: colors.gray[200],
    },
    focused: {
      borderColor: colors.primary[400],
      ...shadows.base,
    },
  },
};

// Animation constants
export const animations = {
  // Duration in milliseconds
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Easing curves
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Export complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  variants,
  animations,
};

export default theme;