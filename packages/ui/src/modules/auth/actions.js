import axios from 'axios'
import Cookies from 'universal-cookie'
import { isEmpty } from 'lodash'
import { message } from 'antd'
import {
  getUserSessionInfo,
  getTokens,
  logout as FSILogout,
  getBaseUrls
  // getCurrentTabOpen
} from '@fusang/sso-client'
import {
  CONFIRM_MFA_CODE_FAILURE,
  CONFIRM_MFA_CODE_REQUEST,
  CONFIRM_MFA_CODE_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_ACTION,
  NEW_PASSWORD_REQUIRED_FAILURE,
  NEW_PASSWORD_REQUIRED_REQUEST,
  NEW_PASSWORD_REQUIRED_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  SETUP_MFA_FAILURE,
  SETUP_MFA_REQUEST,
  SETUP_MFA_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UPDATE_IFRAME_STATE,
  VERIFY_CREDENTIAL_FAILURE,
  VERIFY_CREDENTIAL_REQUEST,
  VERIFY_CREDENTIAL_SUCCESS,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_FAILURE
} from './action-type'
import { globalErrorHandlers, getWithAuth, axiosFSI } from '../../utils/api-call'
import {
  COGNITO_ERROR_CODE,
  COGNITO_MESSAGE,
  ERROR_MESSAGE
} from '../../constants/message.constant'
import { API_PATH } from '../../constants/api-path.constant'
import { TRANSITION_PAGE_PATH } from '../../routers/route.constant'

const psl = require('psl')

const cookies = new Cookies()
const url = window.location.hostname.toString()

export const verifyCredential = ({ email, password, uid, onError }) => {
  return async (dispatch) => {
    console.log('verifyCredential', onError)
    dispatch({
      type: VERIFY_CREDENTIAL_REQUEST,
      payload: {
        uid: uid
      }
    })
    try {
      const formData =
        'login=' +
        encodeURIComponent(`${email}`) +
        '&password=' +
        encodeURIComponent(`${password}`)

      const result = await axios.post(API_PATH.FSI.LOGIN(uid), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log('result', result)
      const { step, qrCodeLink, code, waitTime } = result.data
      if (typeof step === typeof undefined) {
        message.error('Your session is expired!')
        setTimeout(() => {
          window.location = getBaseUrls().loginUrl
        }, 2000)
      }
      dispatch({
        type: VERIFY_CREDENTIAL_SUCCESS,
        payload: {
          step,
          qrCodeLink,
          code,
          email,
          qrCodeWaitTime: waitTime
        }
      })
    } catch (e) {
      console.log('Login error', e)
      if (e?.response?.data?.code === 'TEMPORARY_PASSWORD_EXPIRED') {
        onError && onError(e)
      }
      dispatch({ type: VERIFY_CREDENTIAL_FAILURE })
      if (
        e?.response?.data?.code === COGNITO_ERROR_CODE.NOT_AUTHORIZED_EXCEPTION
      ) {
        switch (e?.response?.data?.message) {
          case COGNITO_MESSAGE.USER_IS_DISABLED: {
            message.error(ERROR_MESSAGE.USER_IS_DEACTIVATED, 5)
            break
          }
          case ERROR_MESSAGE.UNVERIFIED_EMAIL: {
            window.location = TRANSITION_PAGE_PATH.EMAIL_DELIVERED
            break
          }
          default:
            message.error(e?.response?.data?.message, 5)
        }
      } else {
        if (e?.response?.data?.code !== 'TEMPORARY_PASSWORD_EXPIRED') {
          globalErrorHandlers(e)
        }
      }
    }
  }
}

export const confirmMFACode = ({ code }) => {
  return async (dispatch, getState) => {
    dispatch({ type: CONFIRM_MFA_CODE_REQUEST })
    const { uid } = getState().auth
    try {
      const formData = `code=${encodeURIComponent(code)}`

      console.log('MFA link', API_PATH.FSI.CONFIRM_MFA_CODE(uid))
      const res = await axios.post(API_PATH.FSI.CONFIRM_MFA_CODE(uid), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })
      const { redirect } = res.data
      console.log('confirmMFACode After verify MFA code', res.data)
      const initRedirect = sessionStorage.getItem('redirectLink')

      if (initRedirect) {
        dispatch({
          type: UPDATE_IFRAME_STATE,
          payload: {
            showing: true,
            src: redirect
          }
        })
        dispatch(redirectBack(initRedirect, CONFIRM_MFA_CODE_SUCCESS))
      } else {
        dispatch(redirectBack(redirect, CONFIRM_MFA_CODE_SUCCESS))
      }
    } catch (e) {
      dispatch({ type: CONFIRM_MFA_CODE_FAILURE })
      globalErrorHandlers(e)
    }
  }
}

export const redirectBack = (initRedirect, successActionType) => {
  // Wait for success message and redirect iframe load completely
  const waitTime = 2 // seconds
  console.log('Login successful! You will be redirected to home page')
  message.success('Login successful! You will be redirected to home page')
  return async (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: UPDATE_IFRAME_STATE,
        payload: {
          showing: false,
          src: ''
        }
      })
      console.log('redirect', initRedirect)
      window.location = initRedirect
      dispatch({
        type: successActionType
      })
    }, waitTime * 1000)
  }
}

export const setupMFA = ({ code }) => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth
    dispatch({ type: SETUP_MFA_REQUEST })
    const formData = `code=${encodeURIComponent(code)}`
    try {
      const res = await axios.put(API_PATH.FSI.SETUP_MFA(uid), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })
      const { redirect } = res.data
      console.log('setupMFA After verify MFA code', res.data)
      const initRedirect = sessionStorage.getItem('redirectLink')

      dispatch({
        type: UPDATE_IFRAME_STATE,
        payload: {
          showing: true,
          src: redirect
        }
      })
      dispatch(redirectBack(initRedirect, SETUP_MFA_SUCCESS))
    } catch (e) {
      dispatch({ type: SETUP_MFA_FAILURE })
      if (e?.response?.data?.code === 'InvalidParameterException') {
        message.error(ERROR_MESSAGE.INVALID_CODE, 5)
      } else {
        globalErrorHandlers(e)
      }
    }
  }
}

export const setNewPassword = ({ newPassword }) => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth
    dispatch({ type: NEW_PASSWORD_REQUIRED_REQUEST })
    const formData = 'newPassword=' + newPassword
    try {
      const res = await axios.put(
        API_PATH.FSI.REQUIRE_PASSWORD_CHANGE(uid),
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        }
      )
      const { step, qrCodeLink, code, email, waitTime } = res.data
      dispatch({
        type: NEW_PASSWORD_REQUIRED_SUCCESS,
        payload: {
          step,
          qrCodeLink,
          code,
          email,
          qrCodeWaitTime: waitTime
        }
      })
    } catch (e) {
      dispatch({ type: NEW_PASSWORD_REQUIRED_FAILURE })
      globalErrorHandlers(e)
    }
  }
}

export const signUp = ({
  email,
  password,
  username
}) => {
  return async (dispatch) => {
    dispatch({
      type: SIGN_UP_REQUEST
    })
    try {
      const formData = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}&username=${username}`
      await axios.post(API_PATH.FSI.SIGN_UP, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      dispatch({
        type: SIGN_UP_SUCCESS
      })
    } catch (e) {
      globalErrorHandlers(e)
      dispatch({
        type: SIGN_UP_FAILURE
      })
      throw e
    }
  }
}

export const login = (codeResponse) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST
    })
    try {
      const { email } = await getTokens(codeResponse)
      if (!email) {
        message.error('Invalid user')
        dispatch({
          type: LOGIN_FAILURE
        })
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          isLoggedIn: true
        }
      })
    } catch (e) {
      window.location = getBaseUrls().loginUrl
      dispatch({
        type: LOGIN_FAILURE
      })
    }
  }
}

export const logout = (modalProps = {}) => {
  return async (dispatch) => {
    // await removeTokensFromLocalStorage()
    const currentENV = getEnvironmentName()
    const parsed = psl.parse(url)
    const domain = parsed.domain
    cookies.set(`${currentENV}-forceToLogin`, 'false', {
      path: '/',
      domain: `.${domain}`
    })
    // const currentTabOpened = getCurrentTabOpen()
    // if (!currentTabOpened || currentTabOpened <= 0) {
    //   cookies.set(`${currentENV}-currentTabOpened`, 1, {
    //     path: '/',
    //     domain: `.${domain}`
    //   })
    // }

    FSILogout(modalProps) &&
      dispatch({
        type: LOGOUT_ACTION
      })
  }
}

export const getEnvironmentName = () => {
  if (['poc', 'dev', 'dev2', 'dev3', 'qa', 'qa2', 'uat', 'uat2', 'stg', 'staging', 'staging2'].includes(url.split('.')[0])) {
    return url.split('.')[0]
  }
  return ''
}

const getEmailIdToken = async (dispatch) => {
  try {
    const userSession = await getUserSessionInfo()
    const { userId, email, applications } = userSession
    return { userId, email, applications: JSON.parse(applications) || [] }
  } catch (error) {
    console.log('getEmailIdToken', error)
  }
}

export const getUserInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_INFO_REQUEST
      })
      const userInfo = await getEmailIdToken(dispatch)
      if (isEmpty(userInfo)) return
      const { userId, email } = userInfo
      if (userId) {
        const response = await getWithAuth({
          uri: `/users/${userId}`,
          customAxiosInstance: axiosFSI
        })
        const { Item, userInfoSub } = response.data
        if (Item) {
          const userInfo = {
            givenName: Item.givenName,
            fullName: Item.fullName,
            lastName: Item.lastName,
            phoneNumber: Item.phoneNumber,
            dialCode: Item.dialCode,
            applications: Item.applications,
            username: Item.username,
            userId: Item.userId,
            userInfoSub,
            currentEmailLogin: email
          }
          dispatch({
            type: GET_USER_INFO_SUCCESS,
            payload: {
              userInfo
            }
          })
        }
      }
    } catch (error) {
      dispatch({
        type: GET_USER_INFO_FAILURE
      })
      globalErrorHandlers(error)
    }
  }
}

export const authenticated = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: REFRESH_TOKEN_SUCCESS,
        payload: {}
      })
    } catch (e) {
      dispatch(logout())
    }
  }
}
