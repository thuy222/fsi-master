import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setStep } from '../modules/auth/action-type'
import { Button } from 'antd'
import logoHorizontal from '../assets/images/logo-horizontal-blue.png'
import CloseButton from '../assets/icons/cross-icon.svg'

const FusangHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  z-index: 100;
  position: relative;
  ${(props) => props.theme.media['xs']} {
    background-color: white;
  }

  .container-scrolled & {
    ${(props) => props.theme.media['xs']} {
    box-shadow: 0px 1px 2px #ccc;
    transition: box-shadow 0.2s;
    }
  }

  .fusang-logo {
    width: 127px;
    ${(props) => props.theme.media['xs']} {
      width: 80px;
    }
  }

  .close-btn {
    position: absolute;
    margin-left: auto;
    right: 65px;
    top: 60px;
    width: 18px;
    height: 18px;
    ${(props) => props.theme.media['xs']} {
      position: relative;
      right: 0px;
      top: 0px;
    }
    img {
      margin-top: -16px;
    }
  }

    position: sticky;
    top: 0;
  ${(props) => props.theme.media['xs']} {
    width: 100%;
    padding: 16px;
  }
`

const FusangHeader = ({ isSmall, showCloseBtn = true, onClose, hideLogo = false }) => {
  const dispatch = useDispatch()
  return (
    <FusangHeaderContainer isSmall={isSmall}>
      {!hideLogo && <img className='fusang-logo' alt='FUSANG Sign In' src={logoHorizontal} />}
      {showCloseBtn && <Button
        className='close-btn'
        onClick={onClose ?? (() => dispatch(setStep('')))}
        type='text'
        icon={<img src={CloseButton} />}
      />}
    </FusangHeaderContainer>
  )
}

export default FusangHeader
