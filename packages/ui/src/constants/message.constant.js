export const SUCCESS_MESSAGE = {
  EMAIL_VERIFIED: 'Your email has been verified. Please log in below.',
  EMAIL_VERIFIED_WITH_TEMP_PASSWORD: 'Your email has been verified. A separate email has now been sent with your temporary password.'
}

export const ERROR_MESSAGE = {
  INVALID_EMAIL_FORMAT: 'Invalid email address format.',
  INVALID_CODE: 'Invalid code received for user',
  PASSWORD_NOT_VALID:
    'Password does not match the password policy',
  CONFIRMATION_PASSWORD_NOT_MATCH:
    'Confirmation password does not match the password',
  SAME_PASSWORD: 'New password is the same with current password',
  COGNITO_CODE_WRONG_FORMAT:
    'Invalid verification code provided, please try again.',
  USER_IS_DEACTIVATED: 'Your account has been deactivated.',
  UNVERIFIED_EMAIL: 'Email is unverified'
}

export const HELPER_MESSAGE = {
  MFA_CODE: 'The code should be exactly 6 digits.'
}

export const COGNITO_MESSAGE = {
  USER_IS_DISABLED: 'User is disabled.'
}

export const COGNITO_ERROR_CODE = {
  NOT_AUTHORIZED_EXCEPTION: 'NotAuthorizedException'
}
export const COMMON_ERRORS = {
  SOMETHING_WHEN_WRONG: 'Oop!! Something went wrong',
  NETWORK_ERROR: 'Please check your network connection',
  AXIOS_DEFAULT_ERROR:
    'The action could not be completed. Please try again later'
}
export const INPUT_ERRORS = {
  DATE_TIME_FORMAT: 'Wrong date time format, please input again'
}
