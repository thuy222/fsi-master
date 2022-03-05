import React from 'react'
import { Button } from 'antd';
import styled from 'styled-components'
import ArrowLeftIcon from '../assets/icons/arrow-left.svg'

const MobileHeaderContainer = styled.div`
    font-family: 'Open Sans';
    padding: 12px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0%;
    background-color: white;
    box-shadow: 0px 1px 2px 0px #ccc;;

    .title {
        font-weight: 600;
        font-size: 16px;
        margin: auto;
    }
    .ant-btn.ant-btn-text {
        margin-left: 0px;
        position: absolute;
        font-size: 16px;
        display: flex;
        align-items: center;
        
        img {
            height: 14px;
        }

        img + span {
            margin-left: 7px;
            font-size: 13px;
            font-weight: 600;
        }
    }
`
export const MobileHeader = ({ onBack }) => {
    return <MobileHeaderContainer>
        <Button
            onClick={onBack}
            type="text"
            icon={<img src={ArrowLeftIcon} />}
        >
            Back
        </Button>
        <span className="title">Profile</span>
    </MobileHeaderContainer>
}

export default MobileHeader;