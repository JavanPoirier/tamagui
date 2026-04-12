import { Dimensions } from 'react-native'
import type { MatchMedia, MediaQueryList } from '../types'
import { matchQuery } from './matchQuery'

type Orientation = 'landscape' | 'portrait'

class NativeMediaQueryList implements MediaQueryList {
  private listeners: Array<() => void> = []
  private unsubscribe: (() => void) | null = null

  constructor(private query: string) {
    const subscription = Dimensions.addEventListener('change', () => {
      this.listeners.forEach((listener) => listener())
    })
    this.unsubscribe = () => subscription.remove()
  }

  addListener(listener: () => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: () => void): void {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
    if (this.listeners.length === 0 && this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  match(query: string, { width, height }: { width: number; height: number }): boolean {
    const orientation: Orientation = height > width ? 'portrait' : 'landscape'
    return matchQuery(query, {
      type: 'screen',
      orientation,
      width,
      height,
      'device-width': width,
      'device-height': height,
    })
  }

  get matches(): boolean {
    const { width, height } = Dimensions.get('window')
    const orientation: Orientation = height > width ? 'portrait' : 'landscape'
    return matchQuery(this.query, {
      type: 'screen',
      orientation,
      width,
      height,
      'device-width': width,
      'device-height': height,
    })
  }
}

function nativeMatchMedia(query: string): MediaQueryList {
  return new NativeMediaQueryList(query)
}

let matchMediaImpl: MatchMedia = nativeMatchMedia

export const matchMedia: MatchMedia = (...args) => matchMediaImpl(...args)

export function setupMatchMedia(_: MatchMedia) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof _ !== 'function') {
      if (!process.env.IS_STATIC) {
        console.trace(
          `setupMatchMedia was called without a function, this can cause issues on native`,
          _
        )
      }
    }
  }

  matchMediaImpl = _
  // @ts-ignore
  globalThis['matchMedia'] = _
}
