import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import { Button, Form, message, Space } from 'antd'
import MaterialInput from '../../components/material-input'
import { FormContainer, PasswordPolicy } from '../../components'
import { logout } from '../auth/actions'
import { globalErrorHandlers } from '../../utils/api-call'
import { API_PATH } from '../../constants/api-path.constant'
import { validateMFACode, validatePassword } from '../../utils/auth.util'
import { ERROR_MESSAGE, HELPER_MESSAGE } from '../../constants/message.constant'
import ModalConfirm from '../../components/ModalConfirm'
import { PASSWORD_REGEX } from '../../constants/auth.constant'
import { useIsFirstRender } from '../../utils/custom-hooks'

const ChangePassword = ({ onCancel }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const [confirmModalVisible, setConfirmVisible] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const [changePasswordForm] = Form.useForm()
  const isFirstRender = useIsFirstRender()

  const validateData = (values) => {
    if (values.newPasswordConfirmation !== values.newPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH
      }
    }

    const {
      isValid: isNewPasswordValid,
      message: newPasswordErrorMessage
    } = validatePassword(values.newPassword, 'New password')
    if (!isNewPasswordValid) {
      return {
        isValid: isNewPasswordValid,
        message: newPasswordErrorMessage
      }
    }

    if (values.oldPassword === values.newPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.SAME_PASSWORD
      }
    }

    const { isValid: isMFAValid, message: mfaErrorMessage } = validateMFACode(
      values.mfaCode
    )
    if (!isMFAValid) {
      return {
        isValid: isMFAValid,
        message: mfaErrorMessage
      }
    }
    return { isValid: true }
  }

  const showModalConfirm = (values) => {
    const { isValid, message: errorMessage } = validateData(values)
    if (!isValid) {
      message.error(errorMessage)
      setSubmitting(false)
      return
    }
    setConfirmVisible(true)
  }

  const changePassword = async () => {
    try {
      const values = changePasswordForm.getFieldsValue()
      setSubmitting(true)
      const primaryEmail = _.find(
        userInfo.userInfoSub,
        (item) => item.isPrimaryEmail
      )
      const formData = `email=${encodeURIComponent(
        primaryEmail?.email
      )}&mfaCode=${values.mfaCode}&oldPassword=${
        encodeURIComponent(values.oldPassword)
      }&newPassword=${encodeURIComponent(values.newPassword)}`
      await axios.put(API_PATH.FSI.CHANGE_PASSWORD, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'same-origin'
      })
      dispatch(
        logout({
          showModal: false
        })
      )
    } catch (e) {
      const errorCode = e?.response?.data?.code
      const errorMessage = e?.response?.data?.message
      if (
        errorCode === 'NotAuthorizedException' ||
        errorMessage?.includes('previousPassword')
      ) {
        message.error('Current password is incorrect', 5)
        return
      }
      if (
        errorCode === 'InvalidPasswordException' ||
        errorMessage?.includes('proposedPassword')
      ) {
        message.error('New password does not match the password policy', 5)
        return
      }
      if (errorCode === 'EnableSoftwareTokenMFAException') {
        message.error(ERROR_MESSAGE.INVALID_CODE, 5)
        return
      }
      globalErrorHandlers(e)
    } finally {
      setConfirmVisible(false)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <FormContainer
        form={changePasswordForm}
        initialValues={{ mfaCode: undefined }}
        name='changePasswordForm'
        onFinish={showModalConfirm}
      >
        <Form.Item
          label='Current password'
          name='oldPassword'
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
            label='CURRENT PASSWORD'
            loading={isSubmitting}
            type='password'
          />
        </Form.Item>
        <Form.Item
          label='New password'
          name='newPassword'
          rules={[
            { required: true },
            {
              pattern: PASSWORD_REGEX,
              message: ERROR_MESSAGE.PASSWORD_NOT_VALID
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('oldPassword') !== value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(ERROR_MESSAGE.SAME_PASSWORD))
              }
            })
          ]}
        >
          <MaterialInput
            disallowSpace
            extra={<PasswordPolicy />}
            label='NEW PASSWORD'
            loading={isSubmitting}
            type='password'
          />
        </Form.Item>
        <Form.Item
          label='New password confirmation'
          name='newPasswordConfirmation'
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
            type='password'
          />
        </Form.Item>
        <Form.Item
          label='MFA code'
          name='mfaCode'
          rules={[
            { required: true },
            { pattern: '\\d{6}', message: HELPER_MESSAGE.MFA_CODE, len: 6 }
          ]}
        >
          <MaterialInput
            disallowSpace
            label='2FA CODE (6 DIGITS)'
            loading={isSubmitting}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            return (
              <Button
                block
                htmlType='submit'
                key='submit'
                loading={isSubmitting}
                type='primary'
                disabled={
                  isFirstRender.value || !changePasswordForm.isFieldsTouched(true) ||
                changePasswordForm.getFieldsError().filter(({ errors }) => errors.length).length > 0
                }
              >
                SUBMIT
              </Button>
            )
          }}
        </Form.Item>
      </FormContainer>
      <ModalConfirm
        content={
          'You will be logged out from all currently opened FUSANG applications after password has been changed'
        }
        isConfirmLoading={isSubmitting}
        onCancel={() => {
          setConfirmVisible(false)
        }}
        onOK={changePassword}
        visible={confirmModalVisible}
      />
    </div>
  )
}

export default ChangePassword
