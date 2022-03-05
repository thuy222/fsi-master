import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _, { map, isEmpty } from 'lodash'
import { useTheme } from 'styled-components'
import { Avatar, Dropdown, Typography, Menu, Tooltip, message } from 'antd'
import {
  UserOutlined
} from '@ant-design/icons'
import {
  FSIConstants
} from '@fusang/sso-client'
import { ProfileIframeContainer } from '../dashboard/containers/styled'
import {
  logout as logoutAction,
  getUserInfo as getUserInfoAction
} from '../auth/actions'
import IframeProfile from '../profile'
import { GET_PROFILE_IFRAME_SOURCE } from '../applications/action-type'
import ApplicationIcon from '../../assets/icons/application-icon.svg'
import PasswordIcon from '../../assets/icons/password-icon.svg'
import ProfileIcon from '../../assets/icons/profile-icon.svg'
import SignOutIcon from '../../assets/icons/signout-icon.svg'
import { useWindowSize } from '../../utils/custom-hooks'
import { MobileHeader, SVGIcon } from '../../components'

import ArrowRightIcon from '../../assets/icons/arrow-right.svg'
import UserInfoItem from '../../components/UserInfoItem'
import { getAppNameToDislay } from '../../utils/profile.util'

const { IFRAME_EXCHANGE_DATA_CODE, IFRAME_TARGET_ORIGIN } = FSIConstants
const { SubMenu } = Menu

const defaultIframeStyle = {
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: 700,
  userFullnameMaxLength: 40,
  iconUrl: null,
  iconWidth: 32,
  iconHeight: 32,
  fontFamily: 'Open Sans'
}

const ProfileIframe = (props) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const { isFetchingUserInfo } = useSelector((state) => state.auth)
  const iframeParentSource = useSelector((state) => state.application.source)
  const [appsAccess, setAppsAccess] = useState([])
  const [dropDownVisible, setDropDownVisible] = useState(false)
  const [iframeContainerVisible, setIframeContainerVisible] = useState(false)
  const resetSizeTimeOut = useRef(null)
  const { applications: allApps } = useSelector((state) => state.application)
  const queryParams = new URLSearchParams(props.location.search)
  const [iframeStyle, setIframeStyle] = useState(defaultIframeStyle)
  const iframeWindow = window.parent
  const windowSize = useWindowSize()
  const isMobile = Number(windowSize.width) < theme.breakpoints?.md

  const getParentDomain = () => {
    if (window.parent !== window.window) {
      return iframeParentSource
    }
    return false
  }
  const parentDomain =
    (window.location.ancestorOrigins && window.location.ancestorOrigins[0]) ||
    getParentDomain() ||
    ''

  useEffect(() => {
    const iframeListener = (event) => {
      const { data } = event
      console.log(
        `at: FSI, from: ${event.origin}, action: ${data.action
        }, data: ${JSON.stringify(data.data)}`
      )
      switch (data.action) {
        case 'IFRAME_GET_SOURCE': // Please add this to FSI client
          dispatch({
            type: GET_PROFILE_IFRAME_SOURCE,
            payload: { source: data.data }
          })
          break
        case 'IFRAME_GET_CUSTOM_STYLE': // Please add this to FSI client
          setIframeStyle({ ...iframeStyle, ...data.data })
          break
        case 'IFRAME_USER_UPDATED': // Please add this to FSI client
          dispatch(getUserInfoAction())
          break
        default:
          break
      }
    }
    window.addEventListener('message', iframeListener)
    iframeWindow.postMessage(
      { action: IFRAME_EXCHANGE_DATA_CODE.IFRAME_HAS_LOADED },
      IFRAME_TARGET_ORIGIN
    )
    const color = queryParams.get('color')
    const fontSize = queryParams.get('fontSize')
    const fontWeight = queryParams.get('fontWeight')
    const userFullnameMaxLength = queryParams.get('userFullnameMaxLength')
    const iconUrl = queryParams.get('iconUrl')
    const iconWidth = queryParams.get('iconWidth')
    const iconHeight = queryParams.get('iconHeight')
    const fontFamily = queryParams.get('fontFamily')

    const newIframeStyle = {
      color: color || iframeStyle.color,
      fontSize: Number.parseInt(fontSize) || iframeStyle.fontSize,
      fontWeight: Number.parseInt(fontWeight) || iframeStyle.fontWeight,
      userFullnameMaxLength: Number.parseInt(userFullnameMaxLength) || iframeStyle.userFullnameMaxLength,
      iconUrl: iconUrl || iframeStyle.iconUrl,
      iconWidth: Number.parseInt(iconWidth) || iframeStyle.iconWidth,
      iconHeight: Number.parseInt(iconHeight) || iframeStyle.iconHeight,
      fontFamily: fontFamily || iframeStyle.fontFamily
    }
    setIframeStyle(newIframeStyle)
    return () => {
      document.body.style.backgroundColor = 'white'
      window.removeEventListener('message', iframeListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!allApps.length) {
      return
    }
    const { applications } = userInfo

    const filterUsingApps = (acc, current) => {
      if (applications.includes(current.key)) {
        acc.push(current)
      }
      return acc
    }
    if (applications && applications.length > 0 && allApps.length > 0) {
      let appArr = allApps.reduce(filterUsingApps, [])
      setAppsAccess(appArr)
    }
  }, [userInfo, allApps])

  const logout = () => {
    dispatch(
      logoutAction({
        onCancel: iframeResetSize
      })
    )
  }
  const iframeResetSize = () => {
    resetSizeTimeOut.current = setTimeout(() => {
      iframeWindow.postMessage(
        {
          action: IFRAME_EXCHANGE_DATA_CODE.IFRAME_RESET_SIZE
        },
        IFRAME_TARGET_ORIGIN
      )
      // Wait for animation to finish
    }, 300)
  }
  const iframeFullScreenSize = () => {
    window.clearTimeout(resetSizeTimeOut.current)
    iframeWindow.postMessage(
      {
        action: IFRAME_EXCHANGE_DATA_CODE.IFRAME_FULL_SCREEN
      },
      IFRAME_TARGET_ORIGIN
    )
  }
  const openChangePWD = () => {
    const redirectUri = parentDomain || window?.envConfiguration?.REACT_APP_OIDC_BASE_URL
    window.open(
      `${window.location.origin.toString()}?redirectUri=${redirectUri}#CHANGE_PASSWORD`,
      '_blank'
    )
  }
  const openProfile = () => {
    iframeFullScreenSize()
    dispatch(getUserInfoAction())
    setIframeContainerVisible(true)
  }
  const closeProfile = () => {
    message.destroy()
    setIframeContainerVisible(false)
    iframeResetSize()
  }
  const onDropdownVisibleChange = (visible) => {
    setDropDownVisible(visible)
    if (!visible) {
      iframeResetSize()
    } else {
      iframeFullScreenSize()
    }
  }

  const getParentSource = () => {
    return appsAccess.find((app) => app.baseUrl === parentDomain)?.shortName
  }

  const renderAppsList = () => {
    let appsList = []
    let _appList = [...appsAccess]
    _appList = _.sortBy(_appList, ['shortName'])
    if (_appList.length > 0) {
      appsList = map(
        _appList.filter((a) => a.baseUrl !== parentDomain),
        (app, index) => (
          <Menu.Item key={app.key || index} className='sub-menu-box-item'>
            <a
              href={app.baseUrl}
              onClick={iframeResetSize}
              rel='noreferrer noopener'
              target='_blank'
              className='sub-menu-item'
              style={{ margin: 0 }}
            >
              <div className='app-button' key={app.key}>
                <div className='logo' />
                <div className='app-name'>
                  <Typography.Text ellipsis style={{ width: isMobile ? 300 : '100%' }}>
                    {getAppNameToDislay(app)}
                  </Typography.Text>
                </div>
              </div>
            </a>
          </Menu.Item>
        )
      )
    }
    if (isEmpty(appsList)) {
      return <span style={{ padding: '0.5rem' }}>No application</span>
    } else {
      return appsList
    }
  }

  const dropdownContent = (
    <Menu
      mode='inline'
      className='menu-container'
      onClick={() => { setDropDownVisible(false) }}
    >
      <UserInfoItem userInfo={userInfo} userFullnameMaxLength={iframeStyle.userFullnameMaxLength} userNameStyle={{ color: iframeStyle.color }} />

      <Menu.Item onClick={openProfile} className='dropdown-box-item'>
        <div className='dropdown-item'>
          <SVGIcon style={{ minWidth: 25 }} icon={ProfileIcon} /> <span className='dropdown-item-text'>View Profile</span>
        </div>
      </Menu.Item>
      <SubMenu
        key='sub1'
        placement='bottomRight'
        className='dropdown-box-item'
        popupClassName='iframe-profile-sub-dropdown'
        title={
          <div className='dropdown-item'>
            <SVGIcon style={{ minWidth: 25 }} icon={ApplicationIcon} />
            <span className='dropdown-item-text'>Applications</span>
          </div>
        }
        expandIcon={<SVGIcon style={{ marginLeft: 'auto' }} icon={ArrowRightIcon} />}
      >
        {renderAppsList()}
      </SubMenu>
      <Menu.Item
        className='dropdown-box-item'
        onClick={() => {
          setDropDownVisible(false)
          iframeResetSize()
          openChangePWD()
        }}
      >
        <div className='dropdown-item'>
          <SVGIcon style={{ minWidth: 25 }} icon={PasswordIcon} /> <span className='dropdown-item-text'>Change Password</span>
        </div>
      </Menu.Item>
      <Menu.Item onClick={logout} className='dropdown-box-item'>
        <div className='dropdown-item'>
          <SVGIcon style={{ minWidth: 25 }} icon={SignOutIcon} /><span className='dropdown-item-text'>LOG OUT</span>
        </div>
      </Menu.Item>
    </Menu>
  )

  const dropdownMobileContent = (
    <Menu mode='inline' className='menu-mobile-container' onClick={(event) => {
      setDropDownVisible(false)
      if (event.key !== 'profile' && event.key !== 'logout') {
        iframeResetSize()
      }
    }}>
      <MobileHeader onBack={() => {
        setDropDownVisible(false)
        iframeResetSize()
      }} />
      <UserInfoItem userInfo={userInfo} userFullnameMaxLength={iframeStyle.userFullnameMaxLength} userNameStyle={{ color: iframeStyle.color }} />

      <Menu.ItemGroup title='SETTINGS'>
        <Menu.Item key='profile' onClick={openProfile} className='dropdown-box-item'>
          <div className='dropdown-item'>
            <span className='dropdown-item-text'>View Profile</span>
          </div>
        </Menu.Item>
        <Menu.Item
          key='change-password'
          className='dropdown-box-item'
          onClick={() => {
            iframeResetSize()
            openChangePWD()
          }}
        >
          <div className='dropdown-item'>
            <span className='dropdown-item-text'>Change Password</span>
          </div>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup key='app-list' className='app-list' title='APPLICATIONS'>
        {renderAppsList()}
      </Menu.ItemGroup>
      <Menu.ItemGroup title=''>
        <Menu.Item key='logout' onClick={logout} className='dropdown-box-item'>
          <div className='dropdown-item'>
            <span className='dropdown-item-text special-text'>LOG OUT</span>
          </div>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )
  return (
    <>
      <ProfileIframeContainer
        fontWeight={iframeStyle.fontWeight}
        fontFamily={iframeStyle.fontFamily}
        id='profile-container'
      >
        <Dropdown
          mouseEnterDelay={1}
          onVisibleChange={onDropdownVisibleChange}
          overlay={isMobile ? dropdownMobileContent : dropdownContent}
          overlayClassName={isMobile ? 'iframe-profile-dropdown-mobile iframe-profile-dropdown' : 'iframe-profile-dropdown'}
          placement='bottomRight'
          trigger={['click']}
          visible={dropDownVisible}
          getPopupContainer={() => document.getElementById('profile-container')}
        >
          <div>
            <Avatar
              className='avatar'
              src={iframeStyle.iconUrl}
              icon={<UserOutlined />}
              size={iframeStyle.fontSize * 2.5}
              style={{ cursor: 'pointer', width: iframeStyle.iconWidth, height: iframeStyle.iconHeight }}
            />
          </div>
        </Dropdown>
      </ProfileIframeContainer>
      <IframeProfile
        auditLogSource={getParentSource()}
        closeProfile={closeProfile}
        iframeContainerVisible={iframeContainerVisible}
      />
    </>
  )
}

export default ProfileIframe
