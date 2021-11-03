import { Rule } from '@unocss/core'
import { handler as h } from '../utils'
import { colorResolver } from './color'

const listStyleProps = [
  'none', 'disc', 'circle', 'square',
  'decimal', 'zero-decimal', 'greek', 'roman',
  'upper-roman', 'alpha', 'upper-alpha',
]

export const listStyle: Rule[] = [
  [new RegExp(`^list-((${listStyleProps.join('|')})(?:(-outside|-inside))?)$`), ([, value]) => {
    const style = value.split(/-outside|-inside/)[0]
    const position = /inside|outside/.exec(value) ?? []

    if (position.length) {
      return {
        'list-style-position': `${position[0]}`,
        'list-style-type': `${style}`,
      }
    }
    return {
      'list-style-type': `${style}`,
    }
  }],
  [/^list-(inside|outside)$/, ([, value]) => {
    return {
      'list-style-position': value,
    }
  }],
]

export const boxDecorationBreaks: Rule[] = [
  ['decoration-slice', { 'box-decoration-break': 'slice' }],
  ['decoration-clone', { 'box-decoration-break': 'clone' }],
]

export const caretOpacity: Rule[] = [
  [/^caret-op(?:acity)?-?(.+)$/, ([, d]) => ({ '--un-caret-opacity': h.bracket.percent(d) })],
]

export const caretColors: Rule[] = [
  [/^caret-(.+)$/, colorResolver('caret-color', 'caret')],
]

export const imageRenderings: Rule[] = [
  ['image-render-auto', { 'image-rendering': 'auto' }],
  ['image-render-edge', { 'image-rendering': 'crisp-edges' }],
  ['image-render-pixel', [
    ['-ms-interpolation-mode', 'nearest-neighbor'],
    ['image-rendering', '-webkit-optimize-contrast'],
    ['image-rendering', '-moz-crisp-edges'],
    ['image-rendering', '-o-pixelated'],
    ['image-rendering', 'pixelated'],
  ]],
]

export const appearance: Rule[] = [
  ['appearance-none', {
    'appearance-none': 'none',
  }],
]

// There is no match in the rule，like `bg`
const unMatchedAbbreviation: Record<string, string> = {
  bg: 'background-color',
}

export const variables: Rule[] = [[
  /^(.+)-\$(.+)$/, async([v], config) => {
    const [prop, varName] = v.split(/-\$/)
    if (unMatchedAbbreviation[prop]) {
      return {
        [prop]: `var(--${unMatchedAbbreviation[prop]})`,
      }
    }
    const data = await config.generator.parseUtil(prop)
    // To get the name of the abbreviated attribute
    const variable = Number(data?.length) > 2 ? data![2]![0][0] : varName

    return {
      [prop]: `var(--${variable})`,
    }
  },
]]
