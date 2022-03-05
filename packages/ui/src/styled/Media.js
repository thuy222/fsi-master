export const breakpoints = {
  xxl: 1600,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xs: 480,
}
export const media = Object.keys(breakpoints).reduce((acc, label) => {
  acc[label] = `@media (max-width: ${breakpoints[label]}px)`

  return acc
}, {})
