import React from 'react'
import { AlertStyledContainer } from './styled'
import PropTypes from 'prop-types'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export const TYPE = {
  SUCCESS: 'success',
  ERROR: 'error'
}

const Alert = ({ message, type, ...props }) => {
  const renderIcon = () => {
    switch (type) {
      case TYPE.SUCCESS:
        return <CheckOutlined />
      case TYPE.ERROR:
        return <CloseOutlined />
      default:
        return <CheckOutlined />
    }
  }
  return (
    <AlertStyledContainer {...props} type={type}>
      <div className='symbol'>{renderIcon()}</div>
      <div className='message'>{message}</div>
    </AlertStyledContainer>
  )
}

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
}

Alert.TYPE = TYPE

export default Alert
