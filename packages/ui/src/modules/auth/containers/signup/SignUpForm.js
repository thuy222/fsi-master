import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Button, Form, message, Checkbox, Typography } from 'antd'
import MaterialInput from '../../../../components/material-input'
import { signUp as signUpAction } from '../../actions'
import { setStep } from '../../action-type'
import {
  FormContainer,
  PasswordPolicy,
  TermsAndPolicies
} from '../../../../components'
import { ERROR_MESSAGE } from '../../../../constants/message.constant'
import { validatePassword } from '../../../../utils/auth.util'
import {
  checkEmailRegex,
  checkRulesInput,
  checkUsernameRegex,
  normalizeValue
} from '../../../../utils/form.util'
import { AUTH_PATH, TRANSITION_PAGE_PATH } from '../../../../routers/route.constant'
import { PageHeader, SubHeader } from '../authentication-form/styled'
import { CenterContent } from '../../../../layout/authentication-layout'
import { useIsFirstRender } from '../../../../utils/custom-hooks'
import { PASSWORD_REGEX } from '../../../../constants/auth.constant'

const SignUpForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const history = useHistory()
  const [isSubmitting, setSubmitting] = useState(false)
  const [termsAndPoliciesChecked, setTermsAndPoliciesChecked] = useState(false)
  const isFirstRender = useIsFirstRender()

  const validateData = (values) => {
    if (values.password !== values.confirmPassword) {
      return {
        isValid: false,
        message: ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH
      }
    }

    const { isValid, message: passwordErrorMessage } = validatePassword(
      values.password
    )
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

  const signUp = async (values) => {
    try {
      message.destroy()
      setSubmitting(true)
      const email = form.getFieldValue('email')
      form.setFieldsValue({ email: email.trim() })
      const validatingValues = await form.validateFields()
      const { isValid, message: errorMessage } = validateData(validatingValues)
      if (!isValid) {
        message.error(errorMessage)
        setSubmitting(false)
        return
      }

      await dispatch(signUpAction(values))
      history.push({
        pathname: TRANSITION_PAGE_PATH.EMAIL_DELIVERED,
        state: {
          email: email.trim(),
          type: 'SIGN_UP',
          message:
            'Go to your inbox (or spam folder) <br/>' +
            'and click on the link in the email we sent you to complete your registration.'
        }
      })
    } catch (e) {
      console.log(e)
    } finally {
      setSubmitting(false)
    }
  }

  const onBlurEmail = () => {
    const { email, username } = form.getFieldsValue(['email', 'username'])
    if (!username && email && email.trim()) {
      form.setFieldsValue({ username: getUsernameFromEmail(email) })
    }
  }

  const getValueUsername = (evt) => {
    if (evt.target?.value) {
      return getUsernameFromEmail(evt.target.value)
    } else return ''
  }

  const getUsernameFromEmail = (email) => {
    let result = email.trim().split(' ').join('')
    const atPosition = result.indexOf('@')
    result = result.substring(0, atPosition !== -1 ? atPosition : result.length)
    return result.toLowerCase()
  }

  return (
    <CenterContent>
      <div>
        <PageHeader level={2}>Welcome to FUSANG</PageHeader>
        <SubHeader>
          Already Registered?&nbsp;&nbsp;<span className='action' onClick={() => { window.location = '/' }}>LOGIN</span>
        </SubHeader>
      </div>
      <FormContainer form={form} name='signUpForm' onFinish={signUp}>
        <Form.Item
          getValueFromEvent={(e) => normalizeValue(e?.target?.value)}
          label='Email'
          name='email'
          rules={checkRulesInput({
            label: 'Email',
            regExp: {
              pattern: checkEmailRegex,
              message: 'Please input valid email!'
            }
          })}
        >
          <MaterialInput
            autoFocus
            disallowSpace
            label='EMAIL'
            loading={isSubmitting}
            onBlur={onBlurEmail}
            required
          />
        </Form.Item>
        <Form.Item
          getValueFromEvent={getValueUsername}
          label='USERNAME'
          name='username'
          rules={checkRulesInput({
            label: 'Username',
            regExp: {
              pattern: checkUsernameRegex,
              message: 'Please input valid username!'
            }
          })}
        >
          <MaterialInput label='USERNAME' loading={isSubmitting} required />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true },
            {
              pattern: PASSWORD_REGEX,
              message: ERROR_MESSAGE.PASSWORD_NOT_VALID
            }
          ]}
        >
          <MaterialInput
            disallowSpace
            extra={<PasswordPolicy />}
            label='PASSWORD'
            loading={isSubmitting}
            required
            type='password'
          />
        </Form.Item>
        <Form.Item
          label='Confirm password'
          name='confirmPassword'
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(ERROR_MESSAGE.CONFIRMATION_PASSWORD_NOT_MATCH))
              }
            })
          ]}
        >
          <MaterialInput
            disallowSpace
            label='CONFIRM PASSWORD'
            loading={isSubmitting}
            required
            type='password'
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={termsAndPoliciesChecked}
            onChange={(e) => setTermsAndPoliciesChecked(e?.target?.checked)}
          >
            <Typography.Text>I agree to FUSANG&apos;s <TermsAndPolicies /></Typography.Text>
          </Checkbox>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            return (
              <Button
                block
                htmlType='submit'
                key='submit'
                loading={isSubmitting}
                size='large'
                type='primary'
                disabled={
                  isFirstRender.value || !form.isFieldsTouched(true) || isSubmitting || !termsAndPoliciesChecked ||
                form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                }
              >
                REGISTER
              </Button>
            )
          }}
        </Form.Item>
      </FormContainer>
    </CenterContent>
  )
}

export default SignUpForm
