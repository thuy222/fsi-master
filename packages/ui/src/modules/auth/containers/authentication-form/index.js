import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { LoginForm } from '../index'
import { USER_CHALLENGE_NAME } from '../../../../constants/auth.constant'
import MFATokenVerification from '../mfa-token-verification'
import MFASetup from '../mfa-setup'
import NewPasswordRequired from '../new-password-required'
import SignUpForm from '../signup/SignUpForm'
import { InitRecoveryPassword } from '../forgot-password'
import { FullContent } from '../../../../layout/authentication-layout'
import { FusangHeader } from '../../../../components'
import { useIsMobileScreen } from '../../../../utils/custom-hooks'

const AuthenticationForm = () => {
  const { step, iframeState } = useSelector((state) => state.auth)
  const [currentPassword, setCurrentPassword] = useState(undefined)
  const isMobile = useIsMobileScreen()

  const renderComponent = () => {
    if (_.isEmpty(step)) {
      return <LoginForm onLogin={(password) => setCurrentPassword(password)} />
    }

    switch (step) {
      case USER_CHALLENGE_NAME.SMS_MFA:
      case USER_CHALLENGE_NAME.SOFTWARE_TOKEN_MFA:
        return <MFATokenVerification />
      case USER_CHALLENGE_NAME.MFA_SETUP:
        return <MFASetup />
      case USER_CHALLENGE_NAME.NEW_PASSWORD_REQUIRED:
        return <NewPasswordRequired oldPassword={currentPassword} />
      case USER_CHALLENGE_NAME.FORGOT_PASSWORD:
        return <InitRecoveryPassword />
      case USER_CHALLENGE_NAME.SIGN_UP:
        return <SignUpForm />
      default:
        break
    }
  }

  // Only show header when in mobile mode or not in login screen
  const isShowHeader = isMobile || Boolean(step)

  return (
    <>
      <FullContent>
        {isShowHeader && <FusangHeader showCloseBtn={![
          USER_CHALLENGE_NAME.SIGN_IN,
          USER_CHALLENGE_NAME.SIGN_UP,
          USER_CHALLENGE_NAME.NEW_PASSWORD_REQUIRED].includes(step)
        }
        />}
        {renderComponent()}
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
