import React from 'react'
import { Modal, Button } from 'antd'
import CloseButton from '../assets/icons/cross-icon.svg'
import { useIsMobileScreen } from '../utils/custom-hooks'

const ModalConfirm = ({
  visible,
  style = { top: 30 },
  maskClosable = true,
  onCancel,
  onOK,
  content,
  isConfirmLoading,
  okText,
  cancelText
}) => {
  const isMobile = useIsMobileScreen('md')
  const additionProps = isMobile ? {
    transitionName: ''
  } : {}
  return (
    <Modal
      className='new-design bottom-sheet-in-mobile'
      footer={[
        <Button
          style={{ minWidth: 80 }}
          key='submit'
          loading={isConfirmLoading}
          onClick={onOK}
          type='primary'
        >
          {okText || 'Ok'}
        </Button>
      ]}
      keyboard={false}
      maskClosable={maskClosable}
      onCancel={onCancel}
      onOk={onOK}
      style={style}
      title='Confirmation'
      visible={visible}
      width={650}
      closeIcon={<img src={CloseButton} />}
      {...additionProps}
    >
      {content}
    </Modal>
  )
}

export default ModalConfirm
