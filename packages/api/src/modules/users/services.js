import { settings } from '@fsi/core'

import { CognitoIdentityServiceProvider } from '../../utils/awsUtils'

const signUp = async ({ email, password, givenName, lastName, username, referralIdentifier }) => {
  // check if username and email existed
  let checkExistUsername = await fetch(
    `${settings.api.uamBaseUrl}/check-sign-up-fsi`,
    {
      method: 'post',
      body: JSON.stringify({ username, email })
    }
  )

  checkExistUsername = await checkExistUsername.json()
  if (checkExistUsername) throw checkExistUsername
  return CognitoIdentityServiceProvider.signUp({
    ClientId: settings.cognito.userPoolClientId,
    Password: password,
    Username: email,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'given_name',
        Value: givenName || ' '
      },
      {
        Name: 'custom:last_name',
        Value: lastName || ' '
      },
      {
        Name: 'custom:fsiUsername',
        Value: username || ''
      },
      {
        Name: 'custom:referralIdentifier',
        Value: referralIdentifier || ''
      }
    ],
    ClientMetadata: {
      password
    }
  }).promise()
}

export { signUp }
