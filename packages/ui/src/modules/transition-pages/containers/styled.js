import styled from 'styled-components'

export const ResultContainer = styled.div`
  margin: auto;
  .ant-result {
    margin-top: -10vh;
    ${(props) => props.theme.media['xs']} {
      padding: 16px;
    }
  }
  .ant-result-extra {
    ${(props) => props.theme.media['xs']} {
      margin: 12px;
    }
  }
  .ant-result-icon {
    margin-bottom: 16px;
    ${(props) => props.theme.media['xs']} {
      margin-bottom: 8px;
    }
    .anticon-check-circle {
      ${(props) => props.theme.media['xs']} {
        font-size: 40px;
      }
    }
  }
  .resend-text{
    color: #5395FF;
    cursor: pointer;
  }
`
