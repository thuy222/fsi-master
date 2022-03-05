import styled from 'styled-components'

export const PageHeader = styled.h2`
  text-align: center;
  margin: 4px;
  font-size: 30px;
  line-height: 45px;
  font-weight: 600;
  color: ${props => props.theme.colors.brand.black};

  ${(props) => props.theme.media['xs']} {
    font-size: 16px;
    line-height: 35px;
  }
`

export const SubHeader = styled.p`
  margin: 14px 0 60px;
  padding: 0 16px 0 16px;
  text-align: center;
  color: ${props => props.theme.colors.brand.black};

  ${(props) => props.theme.media['xs']} {
    margin: 14px 0 42px;
  }

  .action {
    color: ${props => props.theme.colors.blue};
    font-weight: 600;
    cursor: pointer;
  }
`
