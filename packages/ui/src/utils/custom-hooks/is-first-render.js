import { useRef, useEffect } from 'react'

const useIsFirstRender = () => {
    const isFirstRenderRef = useRef({ value: true });
    useEffect(() => {
        console.log('First render change')
        isFirstRenderRef.current.value = false
        return () => {
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current.value = true
            }
        }
    }, [])
    return isFirstRenderRef.current
}

export default useIsFirstRender;