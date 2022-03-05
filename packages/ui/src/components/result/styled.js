import styled from 'styled-components'
import { Result } from 'antd'

export const ResultStyledComponent = styled(Result)`
  .ant-result-title {
    color: ${props => props.theme.colors.brand.black};
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
  }
  .ant-result-subtitle {
    color: ${props => props.theme.colors.brand.black};
    margin-top: 12px
  }

  .ant-result-extra {
    margin-bottom: 32px;
    & > * {
      margin-right: 0;
    }
  }
`
