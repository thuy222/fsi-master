import { getDeployment, getUAMApiUrl, getFSIApiUrl } from '../utils/api-call'
import uriTemplate from '../utils/uriTemplate'

export const BASE_UAM_API_PATH = getUAMApiUrl(getDeployment())

export const BASE_FSI_API_PATH = getFSIApiUrl(getDeployment())

export const APPLICATION_API_PATH = {
  APPLICATIONS: '/applications'
}

export const CONFIGURATION_API_PATH = {
  CONFIGURATION: '/api/configuration'
}

export const API_PATH = {
  FSI: {
    INIT_PASSWORD_RECOVERY: '/api/password/recovery',
    CONFIRM_PASSWORD_RECOVERY: '/api/password/recovery',
    CHANGE_PASSWORD: '/api/password',
    SIGN_UP: '/api/users',
    LOGIN: (sessionId) => uriTemplate`/interaction/${sessionId}/login`,
    CONFIRM_MFA_CODE: (sessionId) => uriTemplate`/interaction/${sessionId}/mfa/verification`,
    SETUP_MFA: (sessionId) => uriTemplate`/interaction/${sessionId}/mfa/setup`,
    REQUIRE_PASSWORD_CHANGE: (sessionId) => uriTemplate`/interaction/${sessionId}/password`
  },
  UAM: {
    VERIFICATION: '/email/resend-verification'
  }
}
