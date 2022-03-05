import AWS from 'aws-sdk'
import { settings } from '@fsi/core'

const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: settings.cognito.region })

export { CognitoIdentityServiceProvider }
