import styled from 'styled-components'

export const MFAContainer = styled.div`
  max-width: 694px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: auto;
  margin-top: -5vh;
  padding: 35px 100px;
  .ant-typography.title {
    padding-bottom: 12px;
  }
  ${(props) => props.theme.media.xs} {
    border: none;
    padding: 0px;
    margin-top: 0;
  }
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
  .mfa-setup-content {
    ${(props) => props.theme.media.xs} {
      padding: 8px 16px;
    }
  }
`

export const SetUpInformation = styled.div`
  width: 100%;
  flex-direction: column;
  @media (max-width: 480px) {
    margin: 0px;
  }
  .title {
    text-align: center;
    margin-bottom: 20px;
    margin: 0;
    color: ${props => props.theme.colors.brand.black}
  }
  .description {
    text-align: center;
    margin: 20px 0px 42px;
    ${(props) => props.theme.media.xs} {
      margin: 20px 0px 32px;
    }
    p {
      margin: 0;
    }
  }
  .steps-container {
    .step + .step {
      margin-top: 26px;
    }

    ${(props) => props.theme.media.xs} {
      padding-top: 30px;
      border-top: 1px solid #ccc;
    }

    .step {
      display: flex;
      align-items: center;
      .step-number {
        height: 41px;
        width: 41px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000000;
        border-radius: 20px;
        font-size: 18px;
        color: #ffffff;
        font-weight: 600;
        margin-right: 20px;
        ${(props) => props.theme.media.xs} {
          height: 25px;
          width: 25px;
        }
      }
      .step-text {
        flex: 1;
        font-weight: 600;
      }
    }
  }
  .qr-code-information-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 42px;
    ${(props) => props.theme.media.xs} {
      flex-direction: column;
    }

    .label {
      color: #9E9E9E;
      padding: 8px 0 12px 0;
    }
  }
  .or-text {
    font-weight: 500;
    margin-top: 50px;
  }
  .secret-code-wrap {
    display: flex;
    .secret-code-input {
      color: #0e0e0e;
      background-color: #f2f2f7;
      cursor: not-allowed;
      opacity: 1;
      border: 0;
      border-radius: 10px;
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .secret-code-btn {
      margin-left: 15px;
      background-color: #f2f2f7;
      border: none;
      width: 60px;
      height: 40px;
      color: #0e0e0e;
    }
  }

  .mfa-form {
    margin-top: 50px;
    .ant-form-item:last-child {
      margin-bottom: 0;
    }
  }
`
