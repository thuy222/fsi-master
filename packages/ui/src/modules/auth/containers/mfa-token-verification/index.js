import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Typography } from 'antd'
import MaterialInput from '../../../../components/material-input'
import { confirmMFACode } from '../../actions'
import { FormContainer } from '../../../../components'
import { HeaderInformation } from './styled'
import { SubHeader } from '../authentication-form/styled'
import { MFAContainer } from '../mfa-setup/styled'
import styled from 'styled-components'
import { CenterContent } from '../../../../layout/authentication-layout'
import { useIsFirstRender } from '../../../../utils/custom-hooks'
import { HELPER_MESSAGE } from '../../../../constants/message.constant'

const { Title } = Typography

const MFAVerificationContainer = styled.div`
  display: flex;
  flex: 1;
  .container-center-wrapper {
    max-width: 694px!important;
    height: 100%;
  }
`

const MFATokenVerification = () => {
  const [form] = Form.useForm()
  // const [isSubmitting, setSubmitting] = useState(false)
  const { isMfaLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isFirstRender = useIsFirstRender()

  const confirmCode = async ({ code }) => {
    // setSubmitting(true)
    dispatch(confirmMFACode({ code }))
    // setSubmitting(false)
    // setSubmitting(false)
  }

  return (
    <MFAVerificationContainer className='MFAVerificationContainer'>
      <CenterContent className='mfa-verify-container'>
        <MFAContainer>
          <HeaderInformation>
            <Title level={5} className='title'>
              Enter your 2 Factor Authentication
            </Title>
            <SubHeader>
              Please enter your 6-digit 2FA code to access your FUSANG account.
            </SubHeader>
          </HeaderInformation>
          <FormContainer form={form} name='mfaToken' onFinish={confirmCode}>
            <Form.Item
              name='code'
              label='2FA Code'
              rules={[
                { required: true },
                { pattern: '\\d{6}', message: HELPER_MESSAGE.MFA_CODE, len: 6 }
              ]}
            >
              <MaterialInput
                autoFocus
                disallowSpace
                label='2FA CODE (6 DIGITS)'
                loading={isMfaLoading}
                required
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  block
                  htmlType='submit'
                  loading={isMfaLoading}
                  size='large'
                  type='primary'
                  disabled={
                    isFirstRender.value || !form.isFieldsTouched(true) || isMfaLoading ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                  }
                >
                  LOG IN
                </Button>
              )}
            </Form.Item>
          </FormContainer>
        </MFAContainer>
      </CenterContent>
    </MFAVerificationContainer>
  )
}

export default MFATokenVerification
