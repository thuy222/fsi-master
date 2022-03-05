import path from 'path'
import { settings } from '@fsi/core'

export const CLIENT_DIR_PATH = path.join(__dirname, '../../client')

export const APP_CLIENT = {
  client_id: settings.cognito.fusangAppClientId,
  client_secret: settings.cognito.fusangAppClientSecret
}
