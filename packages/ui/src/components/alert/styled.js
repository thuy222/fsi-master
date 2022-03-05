import styled from 'styled-components'
import { TYPE } from './index'

export const AlertStyledContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px ${props => props.theme.colors.brand.black} solid;
  padding: 7px 21px;

  .symbol {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 27px;
    flex-shrink: 0;
    height: 27px;
    border-radius: 50%;
    margin-right: 24px;
    background: ${props => {
    switch (props.type) {
      case TYPE.SUCCESS:
        return props.theme.colors.success
      case TYPE.ERROR:
        return props.theme.colors.danger
      default:
        return props.theme.colors.success
    }
  }};

    .anticon {
      color: #ffffff;
    }
}

  .message {
    font-size: 14px;
    line-height: 26.14px;
    color: ${props => props.theme.colors.brand.black}
  }
`
