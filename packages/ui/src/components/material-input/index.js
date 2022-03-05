import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons'

import { MaterialInputContainer } from './styled'
import { preventSpacePassword } from '../../utils/form.util'

const MaterialInput = ({
  label,
  hasAutoFill = false,
  onChange = () => {},
  type = 'text',
  required = false,
  disabled = false,
  loading = false,
  value,
  extra,
  autoFocus = false,
  onBlur = () => {},
  disallowSpace = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('text')

  useEffect(() => {
    setInputType(type)
  }, [type])

  useEffect(() => {
    if (type === 'password') {
      setInputType(showPassword ? 'text' : 'password')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPassword])

  const onInputChange = (e) => {
    onChange(e)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const renderExtraContent = () => {
    return type === 'password' || extra ? (
      <div className='extra-content'>
        {extra ? <div style={{ marginRight: '8px' }}>{extra}</div> : null}
        {type === 'password' ? (
          <div className='toggle-password'>
            {showPassword ? (
              <EyeInvisibleFilled onClick={toggleShowPassword} />
            ) : (
              <EyeFilled onClick={toggleShowPassword} />
            )}
          </div>
        ) : null}
      </div>
    ) : null
  }

  return (
    <MaterialInputContainer
      hasAutoFill={hasAutoFill}
    >
      <label>
        {label}{' '}
        {required ? <Typography.Text type='danger'>*</Typography.Text> : ''}
      </label>
      <div className='input-block'>
        <input
          autoFocus={autoFocus}
          className={`${props.className || ''} ${loading ? 'input-loading' : ''}`}
          disabled={disabled || loading}
          onBlur={onBlur}
          onChange={onInputChange}
          onKeyDown={disallowSpace ? preventSpacePassword : null}
          type={inputType}
          value={value}
          {...props}
        />
        {renderExtraContent()}
        <span className='bar' />
      </div>
    </MaterialInputContainer>
  )
}

export default MaterialInput
