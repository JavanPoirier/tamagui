import type {
  ColorTokens,
  GetFinalProps,
  SizeTokens,
  StackStyleBase,
  ThemeTokens,
} from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

export interface IconStyleProps extends StackStyleBase {
  size?: number | SizeTokens
  strokeWidth?: number | SizeTokens
  color?: string
}

export type DropShadow = {
  /** Horizontal offset of the shadow in pixels. Defaults to `1`. */
  dx?: number
  /** Vertical offset of the shadow in pixels. Defaults to `1`. */
  dy?: number
  /** Blur radius of the shadow in pixels. Defaults to `3`. */
  blur?: number
  /**
   * Color of the shadow. Defaults to `'rgba(0,0,0,0.3)'`.
   *
   * On native, this value is forwarded directly to `shadowColor` and
   * `shadowOpacity` is set to `1`, so include the desired opacity in the
   * color itself (e.g. `'rgba(0,0,0,0.4)'` rather than `'#000'`).
   */
  color?: string
}

export type NonStyleProps = Omit<SvgProps, keyof IconStyleProps> & {
  disableTheme?: boolean
  style?: SvgProps['style']
  /**
   * Adds a drop shadow to the icon.
   *
   * Pass `true` for a default shadow, or an object to customise
   * `{ dx, dy, blur, color }`.
   *
   * On web this becomes a CSS `filter: drop-shadow(…)`.
   * On native it applies React Native shadow / elevation styles to the SVG
   * container view.
   */
  dropShadow?: DropShadow | boolean
}

export type IconProps = GetFinalProps<NonStyleProps, IconStyleProps, {}>
