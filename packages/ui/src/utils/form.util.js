export const checkRulesInput = ({
  maxLength = 50,
  minLength = 1,
  required = true,
  label = '',
  regExp = null
}) => {
  let rule = [
    {
      required,
      message: '* Required field'
    },
    {
      whitespace: required,
      message: `${label} is required`
    },
    {
      max: maxLength,
      message: `Please enter ${label} maximum ${maxLength} characters!`
    },
    {
      min: minLength,
      message: `Please enter ${label} minimum ${minLength} characters!`
    }
  ]
  if (regExp) {
    rule = [...rule, regExp]
  }
  return rule
}

export const checkEmailRegex = /^[^.\-_](((?!\.\.))[a-zA-Z0-9.\-_])*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gi // 1. Only letters (a-z), numbers (0-9), and periods (.) are allowed. / 2. Allowed to email starting with numbers
export const checkUsernameRegex = /^(?=[a-z0-9])([a-z0-9.@_]+)$/
export const checkCognitoCodeRegex = /^[\S]+$/
export const preventSpacePassword = (evt) =>
  [' '].includes(evt.key) && evt.preventDefault()

export const onBeforeUnload = (event) => {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Older browsers supported custom message
  event.returnValue = 'Changes you made may not be saved.'
}

export const confirmBeforeUnload = (showDialog) => {
  if (showDialog) {
    window.addEventListener('beforeunload', onBeforeUnload)
  } else {
    window.removeEventListener('beforeunload', onBeforeUnload)
  }
}

export const normalizeValue = (value) => {
  return value?.trim?.()?.toLowerCase?.()
}
