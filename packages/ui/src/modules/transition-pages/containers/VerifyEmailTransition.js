/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logout } from '@fusang/sso-client'
import { Alert } from '../../../components'
import { SESSION_STORAGE_KEYS } from '../../../constants/key.constant'
import { SUCCESS_MESSAGE } from '../../../constants/message.constant'

const VerifyEmailTransition = () => {
  const { search } = useLocation()
  const urlParams = new URLSearchParams(search)
  const error = urlParams.get('error')
  const message = urlParams.get('message')
  const isAdminCreated = urlParams.get('isAdminCreated')

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.ALERT_PARAMS, JSON.stringify({
      type: error ? Alert.TYPE.ERROR : Alert.TYPE.SUCCESS,
      message: error ? message : isAdminCreated ? SUCCESS_MESSAGE.EMAIL_VERIFIED_WITH_TEMP_PASSWORD : SUCCESS_MESSAGE.EMAIL_VERIFIED,
      isAdminCreated: isAdminCreated || false
    }))
    setTimeout(async () => {
      logout({ showModal: false }, true)
    }, 300)
  }, [])

  return (
    <></>
  )
}

export default VerifyEmailTransition
