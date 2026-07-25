/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
*/

const RE_MEDIA_QUERY = /(?:(only|not)?\s*([^\s()]+)(?:\s*and)?\s*)?(.+)?/i
const RE_MQ_EXPRESSION = /\(\s*([^\s:)]+)\s*(?::\s*([^\s)]+))?\s*\)/
const RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/
const RE_LENGTH_UNIT = /(em|rem|px|cm|mm|in|pt|pc)?$/
const RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?$/

export function matchQuery(mediaQuery: string, values: Record<string, any>): boolean {
  return parseQuery(mediaQuery).some((query) => {
    if (!query) return false

    const inverse = query.inverse

    const typeMatch = query.type === 'all' || values.type === query.type

    if ((typeMatch && inverse) || !(typeMatch || inverse)) {
      return false
    }

    const expressionsMatch = query.expressions.every((expression) => {
      const feature = expression.feature
      const modifier = expression.modifier
      let expValue = expression.value
      let value = values[feature]

      if (!value) {
        return false
      }

      switch (feature) {
        case 'orientation':
        case 'scan':
          return value.toLowerCase() === expValue.toLowerCase()

        case 'width':
        case 'height':
        case 'device-width':
        case 'device-height':
          expValue = toPx(expValue)
          value = toPx(value)
          break

        case 'resolution':
          expValue = toDpi(expValue)
          value = toDpi(value)
          break

        case 'aspect-ratio':
        case 'device-aspect-ratio':
        case 'device-pixel-ratio':
          expValue = toDecimal(expValue)
          value = toDecimal(value)
          break

        case 'grid':
        case 'color':
        case 'color-index':
        case 'monochrome':
          expValue = Number.parseInt(expValue, 10) || 1
          value = Number.parseInt(value, 10) || 0
          break
      }

      switch (modifier) {
        case 'min':
          return value >= expValue
        case 'max':
          return value <= expValue
        default:
          return value === expValue
      }
    })

    return (expressionsMatch && !inverse) || (!expressionsMatch && inverse)
  })
}

function parseQuery(mediaQuery: string) {
  return mediaQuery.split(',').map((query) => {
    query = query.trim()
    const captures = query.match(RE_MEDIA_QUERY)
    if (!captures) return null

    const modifier = captures[1]
    const type = captures[2]
    const expressionsCapture = captures[3] || ''
    const expressions = expressionsCapture.match(/\([^)]+\)/g) || []

    return {
      inverse: !!modifier && modifier.toLowerCase() === 'not',
      type: type ? type.toLowerCase() : 'all',
      expressions: expressions.map((expression) => {
        const captures = expression.match(RE_MQ_EXPRESSION)
        if (!captures) return { modifier: null, feature: '', value: undefined }
        const feature = captures[1].toLowerCase().match(RE_MQ_FEATURE)
        if (!feature) return { modifier: null, feature: captures[1].toLowerCase(), value: captures[2] }
        return {
          modifier: feature[1],
          feature: feature[2],
          value: captures[2],
        }
      }),
    }
  })
}

function toDecimal(ratio: string) {
  let decimal = Number(ratio)
  if (!decimal) {
    const numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/)
    if (numbers) {
      decimal = Number(numbers[1]) / Number(numbers[2])
    }
  }
  return decimal
}

function toDpi(resolution: string) {
  const value = Number.parseFloat(resolution)
  const units = String(resolution).match(RE_RESOLUTION_UNIT)?.[1]
  switch (units) {
    case 'dpcm':
      return value / 2.54
    case 'dppx':
      return value * 96
    default:
      return value
  }
}

function toPx(length: string) {
  const value = Number.parseFloat(length)
  const units = String(length).match(RE_LENGTH_UNIT)?.[1]
  switch (units) {
    case 'em':
      return value * 16
    case 'rem':
      return value * 16
    case 'cm':
      return (value * 96) / 2.54
    case 'mm':
      return (value * 96) / 2.54 / 10
    case 'in':
      return value * 96
    case 'pt':
      return value * 72
    case 'pc':
      return (value * 72) / 12
    default:
      return value
  }
}
