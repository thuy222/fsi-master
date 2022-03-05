import React from 'react'
import { Menu, Typography, Tooltip } from 'antd'
import { useTheme } from 'styled-components'
import { useWindowSize } from '../utils/custom-hooks'

const UserInfoItem = (props) => {
  const { userInfo = {}, userFullnameMaxLength = 40, userNameStyle } = props
  const theme = useTheme()
  const windowSize = useWindowSize()
  const isMobile = Number(windowSize.width) < theme.breakpoints?.md

  const truncateText = (userInfo, maxLength) => {
    const fullName = `${userInfo?.lastName || ''} ${userInfo?.givenName || ''}`.trim()
    if (!fullName || fullName.length < maxLength) {
      return fullName
    }
    return <>{fullName.substring(0, maxLength)} <Tooltip onClick={e => e.stopPropagation()} placement='bottomRight' title={fullName}> ...</Tooltip> </>
  }

  return <Menu.Item className='user-info-item' style={isMobile ? { borderBottom: 0, paddingLeft: 27 } : {}}>
    <div className='user-info-box' >
      <Typography.Text
        className='name'
        strong
        ellipsis
        style={{
          display: 'inline-block',
          color: 'rgba(0, 0, 0, 0.85)',
          userSelect: 'none',
          textTransform: 'uppercase'
        }}
      >
        {truncateText(userInfo, userFullnameMaxLength)}
      </Typography.Text>
      <Typography.Text
        ellipsis
        style={{ ...userNameStyle, ...{ width: '100%', fontSize: '12px', userSelect: 'none' } }}
      >
        {(userInfo?.username) || ''}
      </Typography.Text>
    </div>
  </Menu.Item>
}

export default UserInfoItem
