import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, message } from 'antd'
import MaterialInput from '../../../../components/material-input'
import { setNewPassword } from '../../actions'
import {
  FormContainer,
  PasswordPolicy
} from '../../../../components'
import { PASSWORD_REGEX } from '../../../../constants/auth.constant'
import { ERROR_MESSAGE } from '../../../../constants/message.constant'
import { validatePassword } from '../../../../utils/auth.util'
import { HeaderInformation } from './styled'
import { CenterContent } from '../../../../layout/authentication-layout'
import { PageHeader, SubHeader } from '../authentication-form/styled'
import { useIsFirstRender } from '../../../../utils/custom-hooks'

const NewPasswordRequired = ({ oldPassword }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [isSubmitting, setSubmitting] = useState(false)
  const isFirstRender = useIsFirstRender()

  const validateData = (newPassword, confirmationPassword) => {
    if (newPassword !== confirmationPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH
      }
    }

    if (newPassword === oldPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.SAME_PASSWORD
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

  const submitNewPassword = async ({ newPassword, newPasswordConfirm }) => {
    try {
      setSubmitting(true)
      const { isValid, message: errorMessage } = validateData(
        newPassword,
        newPasswordConfirm
      )
      if (!isValid) {
        message.error(errorMessage)
        setSubmitting(false)
        return
      }

      await dispatch(setNewPassword({ newPassword }))
      setSubmitting(false)
    } catch (e) {
      setSubmitting(false)
    }
  }

  return (
    <CenterContent alwayBalance>
      <HeaderInformation>
        <PageHeader level={2} className='title'>
          New Password
        </PageHeader>
        <SubHeader>
          You have logged in with a temporary password. Please setup a new password of your choice to continue.
        </SubHeader>
      </HeaderInformation>
      <FormContainer form={form} name='mfaSetup' onFinish={submitNewPassword}>
        <Form.Item
          label='New Password'
          name='newPassword'
          rules={[
            { required: true },
            {
              pattern: PASSWORD_REGEX,
              message: ERROR_MESSAGE.PASSWORD_NOT_VALID
            }
          ]}
        >
          <MaterialInput
            autoFocus
            disallowSpace
            extra={<PasswordPolicy />}
            label='NEW PASSWORD'
            loading={isSubmitting}
            required
            type='password'
          />
        </Form.Item>
        <Form.Item
          label='New Password Confirmation'
          name='newPasswordConfirm'
          dependencies={['newPassword']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH))
              }
            })
          ]}
        >
          <MaterialInput
            disallowSpace
            label='NEW PASSWORD CONFIRMATION'
            loading={isSubmitting}
            required
            type='password'
          />
        </Form.Item>
        <Form.Item shouldUpdate>
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
                SUBMIT
              </Button>
            )
          }}
        </Form.Item>
      </FormContainer>
    </CenterContent>
  )
}

export default NewPasswordRequired
