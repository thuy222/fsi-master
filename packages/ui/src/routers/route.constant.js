export const BASE_PATH = '/public'
export const HOME_PATH = '/'
export const REGISTER_PATH = '/register'
export const AUTH_PATH = {
  LOGIN: '/interaction/:uid'
}

export const TRANSITION_PAGE_PATH = {
  VERIFY_EMAIL: '/interaction/email/verification',
  EMAIL_DELIVERED: '/email/delivered'
}

export const USER_PATH = {
  PASSWORD_RECOVERY: '/user/password/recovery'
}

export const NOT_FOUND_PATH = '/not-found-404'

export const PUBLIC_PATH = [
  AUTH_PATH.LOGIN,
  TRANSITION_PAGE_PATH.VERIFY_EMAIL,
  NOT_FOUND_PATH
]
