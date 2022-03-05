import React, { useEffect, useState } from 'react'
import { Button, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { getBaseUrls } from '@fusang/sso-client'
import { HorizontalLogo } from '../../../components'
import { AuthenticationLayout, CenterContent } from '../../../layout/authentication-layout'

const NotFoundPage = () => {
  const [loginUrl, setLoginUrl] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const { loginUrl } = getBaseUrls()
      setLoginUrl(loginUrl)
    }, 1000)
  }, [])

  return (
    <AuthenticationLayout>
      <CenterContent>
        <HorizontalLogo />
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Typography.Title level={2}>
            The page you visited does not exist
          </Typography.Title>
          <a href={loginUrl}>
            <Button size='large' type='primary'>
              Go to Login page <RightOutlined />
            </Button>
          </a>
        </div>
      </CenterContent>
    </AuthenticationLayout>
  )
}

export default NotFoundPage
