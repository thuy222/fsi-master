import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import QRCode from 'qrcode.react'
import _ from 'lodash'
import { Tooltip, Button, Form, Spin, Typography, Input } from 'antd'

import MaterialInput from '../../../../components/material-input'
import { setupMFA } from '../../actions'
import { FormContainer, SVGIcon } from '../../../../components'
import { MFAContainer, SetUpInformation } from './styled'

import CopyIcon from '../../../../assets/icons/copy.svg'
import { useIsFirstRender, useIsMobileScreen } from '../../../../utils/custom-hooks'
import { HELPER_MESSAGE } from '../../../../constants/message.constant'

const { Title } = Typography

const MFASetup = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [showQrCode, setShowQrCode] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const isMobile = useIsMobileScreen()
  const isFirstRender = useIsFirstRender()
  const { qrCodeLink, qrCodeWaitTime, code } = useSelector(
    (state) => state.auth
  )

  function renderQRCode() {
    if (isMobile) return null
    return <div>
      <div className='label'>QR CODE</div>
      {showQrCode ? (
        <QRCode size='87.5' value={!_.isEmpty(qrCodeLink) ? qrCodeLink : ''} />
      ) : (
        <Spin tip='Generating QR code... Please wait' />
      )}
    </div>
  }

  useEffect(() => {
    const userProcessingTime = 12 // Second
    if (Number(qrCodeWaitTime) >= userProcessingTime) {
      setTimeout(() => {
        setShowQrCode(true)
      }, (Number(qrCodeWaitTime) - userProcessingTime) * 1000)
    } else {
      setShowQrCode(true)
    }
  }, [qrCodeWaitTime])

  const confirmQRCode = async ({ code }) => {
    try {
      setSubmitting(true)
      await dispatch(setupMFA({ code }))
      setSubmitting(false)
    } catch (e) {
      setSubmitting(false)
    }
  }

  const onPartiallyMaskText = (text) => {
    if (!text || text === '') return text
    let result = text.trim()
    result = result.substring(5, result.length - 5)
    result = `XXXXX${result}XXXXX`
    return result
  }

  const onCopyQRCodeToClipboard = () => {
    let tempText = document.createElement('input')
    tempText.value = code
    document.body.appendChild(tempText)
    tempText.select()
    document.execCommand('copy') // for old browser
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code) // for new browser
    }
    document.body.removeChild(tempText)
  }

  const defaultQRCode = onPartiallyMaskText(code)

  return (
    <MFAContainer>
      <SetUpInformation className='mfa-setup-content'>
        <div>
          <Title level={5} className='title'>
            Set up your 2 Factor Authentication
          </Title>
          <div className='description'>
            <span>To keep your account secure, FUSANG applications require 2-factor authentication</span>
          </div>
          <div className='steps-container'>
            <div className='step'>
              <div className='step-number'>1</div>
              <div className='step-text'>
                Search for "Authenticator App" in your phone’s App store.
              </div>
            </div>
            <div className='step'>
              <div className='step-number'>2</div>
              <div className='step-text'>
                Download your preferred authentication App (we recommend Google Authenticator)
              </div>
            </div>
            <div className='step'>
              <div className='step-number'>3</div>
              <div className='step-text'>
                Scan the QR code with the App OR input the secret code in the App
              </div>
            </div>
          </div>
        </div>
        <div className='qr-code-information-wrap'>
          {renderQRCode()}
          {!isMobile && <div className='or-text'>or</div>}
          <div>
            <div className='label'>SECRET CODE</div>
            <div className='secret-code-wrap'>
              <Input
                className='secret-code-input'
                defaultValue={defaultQRCode}
                disabled
              />
              <Tooltip title='Copied' trigger='click' overlayClassName='copied-tooltip'>
                <Button
                  className='secret-code-btn'
                  type='primary'
                  icon={<SVGIcon style={{ minWidth: 25 }} icon={CopyIcon} />}
                  onClick={onCopyQRCodeToClipboard}
                  size='small'
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <FormContainer form={form} className='mfa-form' name='mfaSetup' onFinish={confirmQRCode}>
          <Form.Item label='Code' name='code' rules={[
            { required: true },
            { pattern: '\\d{6}', message: HELPER_MESSAGE.MFA_CODE, len: 6 }
          ]}>
            <MaterialInput
              autoFocus
              disabled={!showQrCode}
              disallowSpace
              label='2FA CODE (6 DIGITS)'
              loading={isSubmitting}
              placeholder='e.g. 123456'
              required
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                block
                htmlType='submit'
                loading={isSubmitting}
                size='large'
                type='primary'
                disabled={
                  isFirstRender.value || !showQrCode || !form.isFieldsTouched(true) || isSubmitting ||
                form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                }
              >
                LOG IN
              </Button>
            )}
          </Form.Item>
        </FormContainer>
      </SetUpInformation>
    </MFAContainer>
  )
}

export default MFASetup
