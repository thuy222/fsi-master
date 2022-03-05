import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getBaseUrls, getUserSessionInfo } from '@fusang/sso-client'
import { getUserInfo, login, authenticated } from '../modules/auth/actions'
import { getApplications } from '../modules/applications/actions'
import { PARAM_ERROR_KEY, REDIRECT_ERROR_KEY } from '../constants/key.constant'

const AuthenticatedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { search } = useLocation()
  const urlParams = new URLSearchParams(search)
  const code = urlParams.get('code')

  useEffect(() => {
    const { loginUrl } = getBaseUrls()
    ;(async () => {
      try {
        const userSession = await getUserSessionInfo()
        if (userSession && userSession.email) {
          dispatch(authenticated())
        } else {
          if (code) {
            dispatch(login(code))
          } else {
            const verifier = urlParams.get('verifier')
            const redirectUrl = verifier ? loginUrl + `&verifier=${verifier}` : loginUrl

            const url = new URL(window.location.href)
            const errorDetail = url.searchParams.get(PARAM_ERROR_KEY)

            if (errorDetail) {
              sessionStorage.setItem(REDIRECT_ERROR_KEY, errorDetail)
            }

            window.location = redirectUrl
          }
        }
      } catch (e) {
        console.log('UserValidation - error: ', e)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserInfo())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getApplications())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  return <>{isLoggedIn && children}</>
}

export default AuthenticatedRoute
