import styled from 'styled-components'

export const HeaderInformation = styled.div`
  .title {
    text-align: center;
    margin-bottom: 20px;
    margin: 0;
    color: ${props => props.theme.colors.brand.black}
  }
  .description {
    text-align: center;
    margin: 20px 0;
  }
`
