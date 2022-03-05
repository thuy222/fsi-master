import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const PasswordPolicyContainer = styled.div`
  .title {
    margin-bottom: 4px;
  }
  .policy {
    margin: 0 0 0 8px;
  }
`

const PasswordPolicy = () => {
  return (
    <Tooltip
      title={
        <PasswordPolicyContainer>
          <p className="title">The password must have:</p>
          <p className="policy"> - 8 or more characters</p>
          <p className="policy"> - Upper and lowercase letters</p>
          <p className="policy"> - At least one number</p>
          <p className="policy"> - At least one symbol in</p>
          <p className="policy"> &nbsp; (!@#$%^&*)</p>
        </PasswordPolicyContainer>
      }
    >
      <QuestionCircleOutlined />
    </Tooltip>
  )
}

export default PasswordPolicy
