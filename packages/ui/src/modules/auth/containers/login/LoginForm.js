import { Button, Form, Typography, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openModal, COOKIE_NAME } from '@fusang/sso-client'
import MaterialInput from '../../../../components/material-input'
import { verifyCredential, getEnvironmentName } from '../../actions'
import { USER_CHALLENGE_NAME } from '../../../../constants/auth.constant'
import { setStep } from '../../action-type'
import { Alert, FormContainer, HorizontalLogo, TermsAndPolicies } from '../../../../components'
import { normalizeValue } from '../../../../utils/form.util'
import Cookies from 'universal-cookie'
import psl from 'psl'
import { PageHeader, SubHeader } from '../authentication-form/styled'
import { LoginFormContainer } from './styled'
import { useIsFirstRender, useIsMobileScreen } from '../../../../utils/custom-hooks'
import { CenterContent } from '../../../../layout/authentication-layout'
import { SESSION_STORAGE_KEYS } from '../../../../constants/key.constant'
import { REGISTER_PATH } from '../../../../routers/route.constant'

const cookies = new Cookies()
const url = window.location.hostname.toString()

const LoginForm = ({ onLogin }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const [alertState, setAlertState] = useState({
    visible: false,
    type: '',
    message: '',
    isAdminCreated: false
  })
  const [form] = Form.useForm()
  const isMobile = useIsMobileScreen()
  const dispatch = useDispatch()
  const param = useParams()
  const history = useHistory()
  const isFirstRender = useIsFirstRender()

  useEffect(() => {
    const currentENV = getEnvironmentName()
    const parsed = psl.parse(url)
    const domain = parsed.domain
    cookies.set(`${currentENV}-forceToLogin`, 'false', {
      path: '/',
      domain: `.${domain}`
    })
    const logoutModal = cookies.get(COOKIE_NAME.LOGOUT_MODAL)
    if (logoutModal) {
      openModal(logoutModal)
    }

    getAlertMessage()
  }, [])

  const getAlertMessage = () => {
    const alertParams = JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_KEYS.ALERT_PARAMS))
    if (alertParams) {
      setAlertState({
        visible: true,
        type: alertParams.type,
        message: alertParams.message,
        isAdminCreated: alertParams.isAdminCreated
      })
      window.sessionStorage.removeItem(SESSION_STORAGE_KEYS.ALERT_PARAMS)
    }
  }

  const login = async (values) => {
    setAlertState({
      visible: false
    })
    try {
      message.destroy()
      setSubmitting(true)
      await dispatch(
        verifyCredential({
          email: values.email.trim(),
          password: values.password.trim(),
          uid: param.uid,
          onError: (error) => {
            let message = error.message
            if (error.response) {
              message = error?.response?.data?.message ?? error.message
            }
            setAlertState({
              visible: true,
              type: 'error',
              message: message
            })
          }
        })
      )
      onLogin && onLogin(values.password)
      setSubmitting(false)
    } catch (e) {
      setSubmitting(false)
      console.log('error', e)
    }
  }

  return (
    <CenterContent>
      {!isMobile && <HorizontalLogo />}
      <div>
        <PageHeader level={2} >Welcome Back</PageHeader>
        <SubHeader style={{ marginBottom: alertState.visible ? '16px' : '60px' }}>
          New to FUSANG?&nbsp;&nbsp;<span className='action' onClick={() => history.push(REGISTER_PATH)}>REGISTER</span>
        </SubHeader>
      </div>
      {alertState.visible && <Alert message={alertState.message} type={alertState.type} style={{ marginBottom: '25px' }} />}
      <LoginFormContainer>
        <FormContainer form={form} name='loginForm' onFinish={login}>
          <Form.Item
            getValueFromEvent={(e) => normalizeValue(e?.target?.value)}
            label='Email'
            name='email'
            rules={[{ required: true }]}
          >
            <MaterialInput
              required
              label='EMAIL/USERNAME'
              loading={isSubmitting}
            />
          </Form.Item>
          {/* The below input element use for disable autocomplete feature of the browser */}
          <input autoComplete='off' name='hidden' type='text' style={{ display: 'none' }} />
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true }]}
          >
            <MaterialInput
              disallowSpace
              label={alertState.isAdminCreated ? 'TEMPORARY PASSWORD' : 'PASSWORD'}
              loading={isSubmitting}
              required
              type='password'
              autoComplete='new-password'
              data-lpignore='true'
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate className='submit'>
            {() => {
              return (
                <Button
                  block
                  htmlType='submit'
                  loading={isSubmitting}
                  size='large'
                  type='primary'
                  disabled={
                    isFirstRender.value || !form.isFieldsTouched(true) || isSubmitting ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                  }
                >
                  LOG IN
                </Button>
              )
            }}
          </Form.Item>
        </FormContainer>
        <div className='forgot-password-link'>
          <TermsAndPolicies />
          <Typography.Link
            onClick={() => {
              dispatch(setStep(USER_CHALLENGE_NAME.FORGOT_PASSWORD))
            }}>Forgot password?</Typography.Link>
        </div>
      </LoginFormContainer>
    </CenterContent>
  )
}

export default LoginForm
