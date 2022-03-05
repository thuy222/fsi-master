import React, { useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import { Button, Form, message } from 'antd'
import MaterialInput from '../../../../components/material-input'
import { globalErrorHandlers } from '../../../../utils/api-call'
import { FormContainer } from '../../../../components'
import { ERROR_MESSAGE } from '../../../../constants/message.constant'
import { API_PATH } from '../../../../constants/api-path.constant'
import { checkEmailRegex } from '../../../../utils/form.util'
import { TRANSITION_PAGE_PATH } from '../../../../routers/route.constant'
import { PageHeader, SubHeader } from '../authentication-form/styled'
import { CenterContent } from '../../../../layout/authentication-layout'
import { useIsFirstRender } from '../../../../utils/custom-hooks'

const InitRecoveryPassword = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [isSubmitting, setSubmitting] = useState(false)
  const isFirstRender = useIsFirstRender()

  const sendVerificationCode = async ({ email }) => {
    try {
      setSubmitting(true)
      const emailRegex = new RegExp(checkEmailRegex)

      if (!emailRegex.test(email)) {
        message.error(ERROR_MESSAGE.INVALID_EMAIL_FORMAT)
        setSubmitting(false)
        return
      }
      const formData = `email=${encodeURIComponent(email)}`
      await axios.post(API_PATH.FSI.INIT_PASSWORD_RECOVERY, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })
      setSubmitting(false)
      history.push({
        pathname: TRANSITION_PAGE_PATH.EMAIL_DELIVERED,
        state: {
          email: email.trim(),
          type: 'FORGOT_PASSWORD',
          message:
            `Go to your <b>primary email's</b> inbox (or spam folder) <br/>` +
            'and click on the link in the email we sent you to reset your password'
        }
      })
    } catch (error) {
      globalErrorHandlers(error)
      setSubmitting(false)
    }
  }

  return (
    <CenterContent alwayBalance>
      <div>
        <PageHeader level={2}>Forgot Password?</PageHeader>
        <SubHeader>
          Enter your registered email to reset your password.
        </SubHeader>
      </div>
      <FormContainer form={form} name='sendCodeForm' onFinish={sendVerificationCode}>
        <Form.Item
          label='EMAIL'
          name='email'
          rules={[
            { required: true },
            { pattern: checkEmailRegex, message: ERROR_MESSAGE.INVALID_EMAIL_FORMAT }
          ]}
        >
          <MaterialInput
            autoFocus
            disallowSpace
            label='EMAIL'
            loading={isSubmitting}
            required
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
              SEND RESET EMAIL LINK
            </Button>
          )}
        </Form.Item>
      </FormContainer>
    </CenterContent>
  )
}

export default InitRecoveryPassword
