export const USER_CHALLENGE_NAME = {
  SMS_MFA: 'SMS_MFA',
  SOFTWARE_TOKEN_MFA: 'SOFTWARE_TOKEN_MFA',
  NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
  MFA_SETUP: 'MFA_SETUP',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SIGN_UP: 'SIGN_UP',
  SIGN_IN: ''
}

/*
 * Password Policy:
 * - At least 8 characters
 * - Upper and lowercase letters
 * - At least 1 number
 * - At least one special character = + - ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ `
 * */
export const PASSWORD_REGEX = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_?])[A-Za-z\\d!@#$%^&*_?.]{8,}$`
