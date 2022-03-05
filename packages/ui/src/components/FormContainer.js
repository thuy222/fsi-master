import React, { useEffect, useState } from 'react'
import { Form as AntForm } from 'antd'
import _ from 'lodash'

const FormContainer = ({
  onFieldsChange,
  onFinishFailed,
  form,
  submitting,
  children,
  ...resProps
}) => {
  const [antForm] = AntForm.useForm()
  const internalForm = form || antForm
  const [isSubmitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (submitting !== undefined) {
      setSubmitting(submitting)
    }
  }, [submitting])

  const fieldsChange = async (changedFields, allFields) => {
    if (!isSubmitting) {
      const fieldData = _.map(changedFields, (field) => ({
        ...field
      }))
      internalForm.setFields(fieldData)
    }

    onFieldsChange && (await onFieldsChange(changedFields, allFields))
  }

  const finishFailed = async ({ values, errorFields, outOfDate }) => {
    try {
      setSubmitting(true)
      await internalForm.validateFields()
    } catch (e) {
      setSubmitting(false)
    }

    onFinishFailed && (await onFinishFailed({ values, errorFields, outOfDate }))
  }

  return (
    <AntForm
      {...resProps}
      form={internalForm}
      onFieldsChange={fieldsChange}
      onFinishFailed={finishFailed}
      validateTrigger={['onChange']}
      validateMessages={{
        required: '* Required field'
      }}
    >
      {children}
    </AntForm>
  )
}

export default FormContainer
