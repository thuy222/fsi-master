import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'
import { getUserSessionInfo } from '@fusang/sso-client'
import SignUpForm from '../signup/SignUpForm'
import { FullContent } from '../../../../layout/authentication-layout'
import { FusangHeader } from '../../../../components'

const AuthenticationForm = () => {
  const { iframeState } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setLoggedIn] = useState(false)

  console.log('isLoggedIn', isLoggedIn)

  useEffect(() => {
    (async () => {
      try {
        const userSession = await getUserSessionInfo()
        if (userSession) {
          setLoggedIn(true)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoggedIn) {
    window.location = `${window.envConfiguration.REACT_APP_OIDC_BASE_URL}?error=40303:user:register`
    return null
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <FullContent>
        <FusangHeader showCloseBtn={false} />
        <SignUpForm />
      </FullContent>
      {iframeState.showing ? (
        <div style={{ height: 0, width: 0 }}>
          <iframe
            frameBorder={0}
            height={0}
            src={iframeState.src}
            title='redirect'
            width={0}
            onLoad={() => {
              console.log('Iframe redirect onload finish')
            }}
          />
        </div>
      ) : null}
    </>
  )
}

export default AuthenticationForm
