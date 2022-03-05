/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import _, { isEmpty } from 'lodash'
import { Skeleton, Typography } from 'antd'
import { AppListContainer, CardContainer, ExtraHeader } from './styled'
import ChangePassword from '../../user/ChangePassword'
import { openModal, ProfileDropdown } from '@fusang/sso-client'
import { FusangHeader } from '../../../components'

import { REDIRECT_ERROR_KEY, PARAM_ERROR_KEY, REDIRECT_URI_KEY } from '../../../constants/key.constant'
import { CenterContent, FullContent } from '../../../layout/authentication-layout'

const PAGES = {
  APPLICATIONS: {
    key: 'APPLICATIONS',
    title: 'Applications'
  },
  CHANGE_PASSWORD: {
    key: 'CHANGE_PASSWORD',
    title: 'Change password'
  }
}

const Dashboard = (props) => {
  const { history } = props
  const { hash } = history.location
  const hashPage = hash.replace('#', '')
  const { userInfo } = useSelector((state) => state.auth)
  const { applications: allApps } = useSelector((state) => state.application)
  const [appsAccess, setAppsAccess] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(
    hashPage && PAGES[hashPage] ? PAGES[hashPage] : PAGES.APPLICATIONS
  )

  useEffect(() => {
    setLoading(true)
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
      appArr = _.sortBy(appArr, ['fullName'])
      setAppsAccess(appArr)
    }
    if (!isEmpty(userInfo)) setLoading(false)
  }, [userInfo, allApps])

  useEffect(() => {
    history.push({ search: history.location.search, hash: currentPage.key })
  }, [currentPage])

  useEffect(() => {
    if (hashPage && hashPage !== currentPage.key) {
      setCurrentPage(PAGES[hashPage] || PAGES.APPLICATIONS)
    }
  }, [hashPage])

  useEffect(() => {
    const url = new URL(window.location.href)
    const errorParams = url.searchParams.get(PARAM_ERROR_KEY)
    const redirectError = sessionStorage.getItem(REDIRECT_ERROR_KEY)
    const errorDetail = errorParams || redirectError

    if (errorDetail) {
      const [errorCode, actor, instance] = errorDetail?.split(':')

      if (errorCode.toString() === '40303') {
        let content = `Please logoff to register a new account.`
        openModal({
          showCancelButton: false,
          okText: 'OK',
          content,
          onOk: () => {
            url.searchParams.delete(PARAM_ERROR_KEY)
          }
        })
        window.history.pushState({}, document.title, window.location.pathname)
        sessionStorage.removeItem(REDIRECT_ERROR_KEY)
      } else {
        const instanceApp = allApps.find((item) => item.key === instance)
        console.log('You need to show modal', actor, allApps, instanceApp)
        if (instanceApp) {
          let content = `You don't have permission to access ${instanceApp.fullName}!`
          if (errorCode.toString() === '40301') {
            content = `Your permission to access ${instanceApp.fullName} has been revoked by administrator!`
          }
          if (errorCode.toString() === '40302') {
            content = `Your authentication to ${instanceApp.fullName} has timed out due to inactivity.`
          }
          console.log('OPEN modal', content)
          openModal({
            showCancelButton: false,
            okText: 'OK',
            content,
            onOk: () => {
              url.searchParams.delete(PARAM_ERROR_KEY)
            }
          })
          window.history.pushState({}, document.title, window.location.pathname)
          sessionStorage.removeItem(REDIRECT_ERROR_KEY)
        }
      }
    }
  }, [allApps])

  const onPageCancel = () => {
    setCurrentPage(PAGES.APPLICATIONS)
  }

  const renderPages = () => {
    switch (hashPage) {
      case PAGES.CHANGE_PASSWORD.key:
        return <ChangePassword onCancel={() => onPageCancel()} />
      default:
        return (
          <AppListContainer>
            {isLoading ? (
              <Skeleton active />
            ) : appsAccess.length > 0 ? (
              _.map(appsAccess, (app) => (
                <a
                  href={app.baseUrl}
                  key={app.key}
                  rel='noreferrer noopener'
                  target='_blank'
                >
                  <div className='app-button' key={app.key}>
                    <div className='logo' />
                    <div className='app-name'>{app.fullName}</div>
                  </div>
                </a>
              ))
            ) : (
              <Typography.Title level={4}>
                No application. Please contact your Administrator
              </Typography.Title>
            )}
          </AppListContainer>
        )
    }
  }

  function handleCloseChangePassword() {
    const searchParam = new URLSearchParams(window.location.search)
    const redirectParam = searchParam.get(REDIRECT_URI_KEY)
    if (redirectParam) {
      window.location = redirectParam
    } else {
      onPageCancel()
    }
  }

  return (
    <FullContent>
      <FusangHeader
        showCloseBtn={[
          PAGES.CHANGE_PASSWORD.key
        ].includes(currentPage.key)}
        onClose={handleCloseChangePassword}
      />
      <CenterContent>
        <CardContainer
          extra={
            <ExtraHeader className='application-dashboard-header'>
              <ProfileDropdown
                appClientId={window.envConfiguration.REACT_APP_CLIENT_ID}
              />
            </ExtraHeader>
          }
          title={
            <div className='card-title'>
              <Typography.Title className='title' level={5}>
                {currentPage.title}
              </Typography.Title>
            </div>
          }
        >
          {renderPages()}
        </CardContainer>
      </CenterContent>
    </FullContent>
  )
}

export default Dashboard
