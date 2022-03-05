import React, { useRef, useState } from 'react'
import {
  AuthenticationLayoutContainer,
  IframeLayoutContainer
} from './styled'

const AuthenticationLayout = (props) => {
  const containerRef = useRef()
  const [isActiveScroll, setActiveScrollHeader] = useState()
  const { children } = props

  function onScrollHandler() {
    if (containerRef.current?.scrollTop > 0) {
      setActiveScrollHeader(true)
    } else {
      setActiveScrollHeader(false)
    }
  }

  return (
    <AuthenticationLayoutContainer
      ref={containerRef}
      onScroll={onScrollHandler}
      className={isActiveScroll && 'container-scrolled'}
    >
      <div className='content-wrapper'>
        {children}
      </div>
      <div className='footer'>
        <div className='branch'>{`© 2015 - ${new Date().getFullYear()} FUSANG Corp`}</div>
      </div>
    </AuthenticationLayoutContainer>
  )
}

function CenterContent({ children, className, alwayBalance, ...rest }) {
  return <div
    className={alwayBalance ? 'container-center-wrapper alway-balance' : 'container-center-wrapper balance'}
    onScroll={() => { console.log('SCROLLING') }}
  >
    <div className={['container-center', className].join(' ')} {...rest}>
      {children}
    </div>
  </div>
}

function FullContent({ children, ...rest }) {
  return <div className='container-full' {...rest}>
    {children}
  </div>
}

const IframeLayout = (props) => {
  const { children } = props

  return (
    <IframeLayoutContainer>
      <div className='content'>{children}</div>
    </IframeLayoutContainer>
  )
}

export { AuthenticationLayout, IframeLayout, CenterContent, FullContent }
