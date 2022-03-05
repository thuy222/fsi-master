import { useTheme } from 'styled-components'
import useWindowSize from './window-resize'

const useIsMobileScreen = (scale = 'xs') => {
  const theme = useTheme()
  const windowSize = useWindowSize()
  const isMobile = Number(windowSize.width) < theme.breakpoints?.[scale]
  return isMobile
}

export default useIsMobileScreen
