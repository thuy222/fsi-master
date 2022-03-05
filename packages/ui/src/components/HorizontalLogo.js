import React from 'react'
import styled from 'styled-components'
import logoHorizontal from '../assets/images/logo-horizontal-blue.png'

const LogoContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  img {
    width: 45%;
  }

  ${(props) =>
    props.isSmall && `
      display: inherit;
      height: 56px;
      width: 127px;
      position: fixed;
      top: 0;
      left: 0;
      padding-top: 20px;
      padding-left: 40px;
      width: 127px;
      background: #FFFFFF;
      img {
        width: inherit;
        object-fit: contain;
      }
      @media (max-width: 480px) {
        width: 100%;
        padding-left: 16px;
        img {
          width: 127px;
        }
      }
  `}
`

const HorizontalLogo = ({ isSmall }) => {
  return (
    <LogoContainerStyled isSmall={isSmall} className={'main-logo'}>
      <img alt='FUSANG Sign In' src={logoHorizontal} />
    </LogoContainerStyled>
  )
}

export default HorizontalLogo
