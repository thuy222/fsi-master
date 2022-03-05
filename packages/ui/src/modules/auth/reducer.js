import {
  CONFIRM_MFA_CODE_REQUEST,
  CONFIRM_MFA_CODE_SUCCESS,
  CONFIRM_MFA_CODE_FAILURE,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_ACTION,
  NEW_PASSWORD_REQUIRED_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  SET_STEP,
  SIGN_UP_SUCCESS,
  UPDATE_IFRAME_STATE,
  VERIFY_CREDENTIAL_REQUEST,
  VERIFY_CREDENTIAL_SUCCESS,
  VERIFY_ALTERNATIVE_EMAIL_SUCCESS,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_FAILURE
} from './action-type'

const initialState = {
  isLoggedIn: false,
  uid: '',
  step: '',
  qrCodeLink: null,
  qrCodeWaitTime: 0,
  iframeState: {
    showing: false,
    src: ''
  },
  userInfo: {},
  isFetchingUserInfo: true
}

export default (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
    case VERIFY_CREDENTIAL_REQUEST:
      return {
        ...state,
        uid: payload.uid
      }
    case CONFIRM_MFA_CODE_REQUEST:
      return {
        ...state,
        isMfaLoading: true
      }
    case CONFIRM_MFA_CODE_FAILURE:
      return {
        ...state,
        isMfaLoading: false
      }
    case CONFIRM_MFA_CODE_SUCCESS:
      return {
        ...state,
        isMfaLoading: false,
        isLoggedIn: true
      }
    case VERIFY_CREDENTIAL_SUCCESS:
    case NEW_PASSWORD_REQUIRED_SUCCESS:
      return {
        ...state,
        step: payload.step,
        qrCodeLink: payload.qrCodeLink,
        code: payload.code,
        email: payload.email,
        qrCodeWaitTime: payload.qrCodeWaitTime
      }
    case SET_STEP:
      return {
        ...state,
        step: payload.step
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: payload.isLoggedIn
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false
      }
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        step: ''
      }
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true
      }
    case LOGOUT_ACTION:
      return {
        ...state,
        isLoggedIn: false
      }
    case UPDATE_IFRAME_STATE:
      return {
        ...state,
        iframeState: {
          showing: payload.showing,
          src: payload.src
        }
      }
    case VERIFY_ALTERNATIVE_EMAIL_SUCCESS: {
      return {
        ...state
      }
    }
    case GET_USER_INFO_REQUEST: {
      return {
        ...state,
        isFetchingUserInfo: true
      }
    }
    case GET_USER_INFO_FAILURE: {
      return {
        ...state,
        isFetchingUserInfo: false
      }
    }
    case GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        userInfo: payload.userInfo,
        isFetchingUserInfo: false
      }
    }
    default:
      return state
  }
}
