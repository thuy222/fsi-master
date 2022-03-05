import styled from 'styled-components'
import singleLogoBlue from '../../../assets/images/logo-single-blue.png'
import singleLogoWhite from '../../../assets/images/logo-single-white.png'
import { Card } from 'antd'

export const CardContainer = styled(Card)`
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  .ant-card-head-wrapper {
    .ant-card-extra {
      margin-left: 16px;
    }
    .ant-card-head-title {
      overflow: unset;
      .card-title {
        display: flex;
        flex-direction: column;
        ${(props) => props.theme.media.xs} {
          margin-left: unset;
        }
        .icon {
          font-size: 30px;
          color: ${(props) => props.theme.colors.brand.black};
          margin-right: 12px;
        }
        .title {
          color: ${(props) => props.theme.colors.brand.black};
          margin: 0;
        }
        .divider {
          display: none;
          ${(props) => props.theme.media.xs} {
            display: block;
          }
          margin-top: 5px;
          width: calc(100% + 48px);
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }

    ${(props) => props.theme.media.sm} {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .application-dashboard-header {
    .name-email {
      ${(props) => props.theme.media.xs} {
        display: none;
      }
    }
  }
`
export const ExtraHeader = styled.div`
  display: flex;
  align-items: center;
  .name-email {
    overflow: hidden;
    margin-right: 8px;
    text-align: right;
    display: flex;
    flex-direction: column;
    max-width: 300px;

    .name {
      strong {
        font-weight: 700;
      }
    }
  }
  .avatar {
    flex: 1 0 auto;
    cursor: pointer;
  }
`
export const ProfileIframeContainer = styled(ExtraHeader)`
  justify-content: flex-end;
  max-width: 500px;
  width: fit-content;
  position: relative;

  .name-email {
    width: 200px;
    font-family: ${props => props.fontFamily};
    .name {
      strong {
        font-weight: ${(props) => props.fontWeight};
      }
    }
  }
`

export const AppListContainer = styled.div`
  max-width: 430px;
  width: 100%;
  margin: auto;

  .app-button {
  border: 1px solid ${(props) => props.theme.colors.brand.black};
  border-radius: 4px;
  padding: 8px 24px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  width: 100%;

  .logo {
    width: 30px;
    height: 30px;
    background-image: url("${singleLogoBlue}");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .app-name {
    font-size: 18px;
    width: 100%;
    text-align: center;
    padding: 0 16px;
  }

  &:hover {
    background: ${(props) => props.theme.colors.brand.black};
    .logo {
      background-image: url("${singleLogoWhite}");
    }
    .app-name {
      color: #FFFFFF
    }
  }}
`

export const MobileContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const DashboardContainer = styled.div`
  max-width: 500px;
  margin: auto;
  width: 100%;
  padding: 16px;

  .main-logo {
    img {
      width: 70%;
    }
  }
`
