import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FusangHeader, Result } from '../../../components'
import { Typography, message as alert } from 'antd'
import { FullContent } from '../../../layout/authentication-layout'
import { PageHeader } from '../../auth/containers/authentication-form/styled'
import { ResultContainer } from './styled'
import axios from 'axios'
import { API_PATH } from '../../../constants/api-path.constant'
import { axiosFSI, getWithAuth } from '../../../utils/api-call'
import _ from 'lodash'

const EmailDelivered = () => {
  const { state } = useLocation()
  const [isSubmitting, setSubmitting] = useState(false)
  const [countdownRunning, setCountdownRunning] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    let timer
    if (countdownRunning) {
      if (!countdown) {
        if (timer) clearInterval(timer)
        setCountdownRunning(false)
        setCountdown(60)
      }

      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdownRunning, countdown])

  const message =
    state?.message ||
    'Go to your inbox (or spam folder) <br/>' +
      'and click on the link in the email we sent you to complete your registration.'

  const handleResendEmail = () => {
    if (!isSubmitting && !countdownRunning) {
      if (state?.email) {
        if (state?.type === 'FORGOT_PASSWORD') {
          handleForgotPasswordResendEmail()
        } else if (state?.type === 'SIGN_UP') {
          handleSignUpResendEmail()
        }
      }
    }
  }

  const handleForgotPasswordResendEmail = async () => {
    setSubmitting(true)
    try {
      const formData = `email=${encodeURIComponent(state?.email)}`
      const result = await axios.post(
        API_PATH.FSI.INIT_PASSWORD_RECOVERY,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        }
      )
      afterSubmitted()
      if (result?.status === 200) {
        alert.success('Resend reset password email successfully')
      }
    } catch (error) {
      const errorMes = _.get(error, 'response.data.message', '')
      errorMes && alert.error(errorMes)
      afterSubmitted()
    }
  }

  const handleSignUpResendEmail = async () => {
    setSubmitting(true)
    try {
      const result = await getWithAuth(
        {
          uri: `${API_PATH.UAM.VERIFICATION}/${state?.email}`,
          customAxiosInstance: axiosFSI
        },
        false
      )
      afterSubmitted()
      if (result?.status === 200) {
        alert.success('Email verification sent.')
      }
    } catch (error) {
      const errorMes = _.get(error, 'data.message', '')
      errorMes && alert.error(errorMes)
      afterSubmitted()
    }
  }

  const afterSubmitted = () => {
    setSubmitting(false)
    setCountdownRunning(true)
  }

  return (
    <FullContent>
      <FusangHeader
        hideLogo
        onClose={() => {
          window.location = window.envConfiguration.REACT_APP_OIDC_BASE_URL
        }}
      />
      <ResultContainer>
        <Result
          status='success'
          title={<PageHeader>We’ve sent you an email</PageHeader>}
          extra={
            <>
              {message && (
                <>
                  <Typography.Text>
                    <p dangerouslySetInnerHTML={{ __html: message }} />
                  </Typography.Text>
                  <br />
                </>
              )}
              <Typography.Text>Didn’t get an email from FUSANG?</Typography.Text>
              <br />
              <Typography.Text>
                Contact us at{' '}
                <Typography.Link href={`mailto:${window.envConfiguration.REACT_APP_FUSANG_SUPPORT_EMAIL}`}>
                  {`${window.envConfiguration.REACT_APP_FUSANG_SUPPORT_EMAIL}`}
                </Typography.Link>
                {' '}or{' '}
                <Typography.Link disabled={countdownRunning} onClick={handleResendEmail}>{isSubmitting ? 'Sending email...' : `Resend Email ${countdownRunning ? ` - ${countdown}s` : ''}`}</Typography.Link>
              </Typography.Text>
            </>
          }
        />
      </ResultContainer>
    </FullContent>
  )
}

export default EmailDelivered
