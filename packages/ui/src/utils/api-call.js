import axios from 'axios'
import { message } from 'antd'
import { getBaseUrls } from '@fusang/sso-client'
import { BASE_UAM_API_PATH } from '../constants/api-path.constant'
import { COMMON_ERRORS } from '../constants/message.constant'

export default () => {
  console.log('Set baseFSIURL', getFSIApiUrl(getDeployment()))
  axios.defaults.baseURL = getFSIApiUrl(getDeployment())
  axios.defaults.withCredentials = true
}

export const axiosFSI = axios.create({
  baseURL: BASE_UAM_API_PATH,
  withCredentials: true
})

export const globalErrorHandlers = (error) => {
  console.log('Global error', error.toString())
  if (error?.response?.data?.code === 'NotAuthorizedException') {
    message.error(error.response.data.message, 5)
    window.location = getBaseUrls().loginUrl
    return
  }
  if (error.response && error.response.data) {
    if (error.response.data.message) {
      message.error(error.response.data.message, 5)
    } else {
      message.error(error.toString(), 5)
    }
  }
}

const handleErrors = (applyGlobalErrorHandler, error) => {
  if (!navigator.onLine) {
    const offlineError = { data: { message: COMMON_ERRORS.NETWORK_ERROR } }
    globalErrorHandlers(offlineError)
  } else if (applyGlobalErrorHandler) {
    globalErrorHandlers(error.response)
  }
  throw error.response
}

export const getWithAuth = async (
  { uri, axiosConfig, customAxiosInstance },
  applyGlobalErrorHandler = true
) => {
  const axiosInstance = customAxiosInstance || axios
  let options = { ...axiosConfig }
  return axiosInstance
    .get(uri, options)
    .then((response) => ({
      data: response.data,
      status: response.status
    }))
    .catch((error) => handleErrors(applyGlobalErrorHandler, error))
}

export const putWithAuth = async (
  { uri, body, axiosConfig, customAxiosInstance },
  applyGlobalErrorHandler = true
) => {
  const axiosInstance = customAxiosInstance || axios
  const options = { ...axiosConfig }
  return axiosInstance
    .put(uri, body, options)
    .then((response) => ({
      data: response.data,
      status: response.status
    }))
    .catch((error) => handleErrors(applyGlobalErrorHandler, error))
}

/**
 * get deployment according to domain name
 */
export function getDeployment(hostname = window.location.hostname) {
  const hostReg = /(.*\.)?sign-in\.fusang\.co/
  if (hostReg.test(hostname)) {
    const hostInfo = hostname.match(hostReg)
    return hostInfo[1] ? hostInfo[1].slice(0, -1) : 'production'
  }
  return 'local'
}

export function getFSIApiUrl(deployment = 'local') {
  console.log('getFSIApiUrl', deployment)
  switch (deployment) {
    case 'local':
    //   return 'http://localhost:3201'
      return 'https://dev2.sign-in.fusang.co'
    case 'production':
      return 'https://sign-in.fusang.co'
    default:
      return `https://${deployment}.sign-in.fusang.co`
  }
}

export function getUAMApiUrl(deployment = 'local') {
  console.log('getUAMApiUrl', deployment)
  switch (deployment) {
    case 'local':
    //   return 'http://localhost:3001/DEVLOCAL'
      return 'https://dev2.api.uam.fusang.co/v1'
    case 'production':
      return 'https://api.uam.fusang.co/v1'
    default:
      return `https://${deployment}.api.uam.fusang.co/v1`
  }
}
