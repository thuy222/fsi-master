import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
body {
  font-family: 'Open Sans', sans-serif;
  color: ${props => props.theme.colors.brand.black}
}
// Customize Profile IFrame
.iframe-profile-dropdown-mobile {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.iframe-profile-sub-dropdown, .iframe-profile-dropdown {
  .menu-container, .menu-mobile-container, .ant-dropdown-menu-sub {
    border-radius: 10px;
    padding: 0;
    user-select: none;
    overflow: hidden;
  }

  .menu-mobile-container {
    ${(props) => props.theme.media['xs']} {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100vw;
      height: 100vh;
      overflow: auto;
      display: flex;
      flex-direction: column;

      .app-list {
        flex: 1;
      }
    }
  }

  .menu-container, .menu-mobile-container, .ant-dropdown-menu-sub {
    ${(props) => props.theme.media['xs']} {
      border-radius: 0px;
    }
  }

  .dropdown-box-item, .sub-menu-box-item {
    height: 65px;
    border-bottom: 1px solid #BFC7D0;
    box-sizing: border-box;
    background-color: #FFFFFF;
    &:hover {
      background-color: #F5F5F5;
    }
  }

  .user-info-item {
    padding: 16px;
    user-select: none;
    cursor: default;
    border-bottom: 1px solid #BFC7D0;
    &:hover {
      background-color: #FFFFFF;
    }
  }

  .user-info-box {
    display: flex;
    flex-direction: column;
  }
  
  .dropdown-box-item:last-child {
    border-bottom: 0;
  }

  .sub-menu-box-item:last-child {
    border-bottom: 0;
    ${(props) => props.theme.media['xs']} {
      border-bottom: 1px solid #BFC7D0;
    }
  }

  .dropdown-box-item {
    min-width: 300px;
  }

  .sub-menu-box-item {
    height: 65px;
  }

  .ant-dropdown-menu-submenu-title {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .dropdown-item, .sub-menu-item {
    font-family: 'Open Sans';
    font-weight: 600;
    line-height: 20px;
    font-size: 13px;
    color: #0E0E0E;
    display: flex;
    height: 100%;
    align-items: center;
    padding-left: 30px;
    ${(props) => props.theme.media['xs']} {
      padding-left: 15px;
    }
  }

  .dropdown-item {
    padding-right: 16px;
  }

  .sub-menu-item {
    padding-right: 30px;
  }

  .dropdown-item-text {
    margin-left: 10px;
  }

  .special-text {
    color: red;
  }

  .menu-mobile-container {
    .ant-dropdown-menu-item-group-list{
      overflow-y: auto;
      margin: 0;

      .dropdown-item-text{
        margin-left: 0;
      }
    }

    .ant-dropdown-menu-item-group-title {
      min-height: 32px;
      bacKground-color: #F7F8F9;
      color: #ACBACF;
      border-top: 1px solid #BFC7D0;
      border-bottom: 1px solid #BFC7D0;
      padding-left: 27px;
    }

    .ant-dropdown-menu-item-group{
      background-color: #F7F8F9;
    }

    .ant-dropdown-menu-item-group:first-child > .ant-dropdown-menu-item-group-title,
    .ant-dropdown-menu-item-group:last-child > .ant-dropdown-menu-item-group-title{
      border-top: 0;
    }
  }
}



// General
.ant-component-hidden {
  display: none
}

// Ant Table
.ant-table-wrapper {
  overflow-x: auto;
  .ant-table-scroll-horizontal {
    .ant-table-content{
      overflow-x: auto !important;
    }
  }
}

// Ant form
.ant-form  {
  .ant-form-item {
    .ant-form-item-label {
      display: none;
    }
  }
}

.ant-form-item-explain {
  font-size : 12px;
}

.ant-form-item-explain, .ant-form-item-extra {
  min-height: 30px;
}

.ant-form-item {
  margin-bottom: 30px;
  .ant-form-item-explain {
    div[role="alert"] {
      color: #ff4d4f;
    }
  }
}

.ant-modal.new-design {
    width: 650px;
    .ant-modal-header {
        border-bottom: none;
        text-align: center;
        margin: 15px 0px;
        .ant-modal-title {
            font-size: 18px;
            font-weight: bold;
        }
    }
    .ant-modal-content {
        border-radius: 10px;
        overflow: hidden;
        text-align: center;
        .ant-modal-body {
            padding: 0px 60px;
        }
    }
    .ant-modal-footer {
        border-top: none;
        text-align: center;
        padding: 50px 60px;
        .ant-btn-primary {
            width: 100%;
            text-transform: uppercase;
        }
    }
}

.ant-modal.new-design.bottom-sheet-in-mobile {
    ${(props) => props.theme.media['md']} {
        .ant-modal-header {
            margin-top: 15px;
        }
        .ant-modal-content {
            position: fixed;
            left: 0px;
            bottom: 0px;
            border-radius: 10px 10px 0px 0px;
            .ant-modal-body {
                padding: 0 25px;
            }
            .ant-modal-close {
                display: none;
            }
        }
        .ant-modal-footer {
            padding: 45px 25px;
        }
    }
}

.ant-form-item-with-help {
  margin-bottom: 0px;
}

// Ant button
.ant-btn {
  border-radius: 10px;
  height: 38px;
  &[disabled] {
    background-color: #D8D8D8;
    color: #B2B2B2;
    font-weight: 400;
    &:hover {
      color: #B2B2B2;
      background-color: #D8D8D8;
    }
  }
}

.ant-btn.ant-btn-loading {
    .ant-btn-loading-icon + span {
        display: none;
    }
    /* .hidden-when-loading {
        display: none;
    } */
}

.ant-btn > .ant-btn-loading-icon .anticon {
  padding-right: 0;
  margin-right: 8px;
}

// Logout modal
.tingle-modal-box {
  margin-top: 30px
}

.tingle-modal-box__content {
  padding-bottom: 0px;
}

.copied-tooltip {
  .ant-tooltip-inner {
    background-color: ${props => props.theme.colors.brand.black};
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 14px;
  }
}

/* Safari 10.1+ (alternate method) */

@media not all and (min-resolution:.001dpcm)
{ @supports (-webkit-appearance:none) {
    .main-logo {
      display: block;
      img {
        margin-left: 25%;
      }
    }
}}
`
