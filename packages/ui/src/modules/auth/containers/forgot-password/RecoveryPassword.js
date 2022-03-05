import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Button, Form, message } from 'antd'
import {
  FormContainer,
  FusangHeader,
  PasswordPolicy
} from '../../../../components'
import MaterialInput from '../../../../components/material-input'
import { setStep as setStepAction } from '../../action-type'
import axios from 'axios'
import { API_PATH } from '../../../../constants/api-path.constant'
import { globalErrorHandlers } from '../../../../utils/api-call'
import { useDispatch } from 'react-redux'
import { ERROR_MESSAGE } from '../../../../constants/message.constant'
import { validatePassword } from '../../../../utils/auth.util'
import { useLocation } from 'react-router-dom'
import { HOME_PATH } from '../../../../routers/route.constant'
import { PageHeader } from '../authentication-form/styled'
import { CenterContent, FullContent } from '../../../../layout/authentication-layout'
import { useIsFirstRender } from '../../../../utils/custom-hooks'

const RecoveryPassword = () => {
  const [form] = Form.useForm()
  const [isSubmitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = useLocation()
  const isFirstRender = useIsFirstRender()
  const urlParams = new URLSearchParams(search)
  const email = urlParams.get('email')
  const code = urlParams.get('code')

  const validateData = (newPassword, confirmationPassword) => {
    if (newPassword !== confirmationPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH
      }
    }

    const { isValid, message: passwordErrorMessage } =
      validatePassword(newPassword)
    if (!isValid) {
      return {
        isValid: isValid,
        message: passwordErrorMessage
      }
    }

    return {
      isValid: true
    }
  }

  const resetPassword = async ({ newPassword, newPasswordConfirmation }) => {
    try {
      setSubmitting(true)
      const { isValid, message: errorMessage } = validateData(
        newPassword,
        newPasswordConfirmation
      )
      if (!isValid) {
        message.error(errorMessage)
        setSubmitting(false)
        return
      }
      const formData = `email=${encodeURIComponent(
        email
      )}&code=${code.trim()}&newPassword=${encodeURIComponent(newPassword)}`
      await axios.put(API_PATH.FSI.CONFIRM_PASSWORD_RECOVERY, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })
      message.success('Reset password is successful')
      dispatch(setStepAction(''))
      history.push(HOME_PATH)
    } catch (error) {
      globalErrorHandlers(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FullContent>
      <FusangHeader onClose={() => {
        history.push(HOME_PATH)
      }} />
      <CenterContent alwayBalance>
        <PageHeader style={{ marginBottom: '60px' }} level={2}>Reset Password</PageHeader>
        <FormContainer form={form} name='resetPasswordRequired' onFinish={resetPassword}>
          <Form.Item
            label='New password'
            name='newPassword'
            rules={[{ required: true }]}
          >
            <MaterialInput
              autoComplete='new-password'
              disallowSpace
              extra={<PasswordPolicy />}
              label='NEW PASSWORD'
              loading={isSubmitting}
              required
              type='password'
            />
          </Form.Item>

          <Form.Item
            label='New password confirmation'
            name='newPasswordConfirmation'
            rules={[{ required: true }]}
          >
            <MaterialInput
              autoComplete='new-password'
              disallowSpace
              label='NEW PASSWORD CONFIRMATION'
              loading={isSubmitting}
              required
              type='password'
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {() => (
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
                CONFIRM NEW PASSWORD
              </Button>
            )}
          </Form.Item>
        </FormContainer>
      </CenterContent>
    </FullContent>
  )
}

export default RecoveryPassword
