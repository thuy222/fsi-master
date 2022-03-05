import {
  GET_APPLICATIONS_FAILURE,
  GET_APPLICATIONS_REQUEST,
  GET_APPLICATIONS_SUCCESS
} from './action-type'
import { getWithAuth, axiosFSI } from '../../utils/api-call'
import { APPLICATION_API_PATH } from '../../constants/api-path.constant'

export const getApplications = () => {
  return async (dispatch) => {
    dispatch({
      type: GET_APPLICATIONS_REQUEST
    })
    try {
      const { data } = await getWithAuth({
        uri: APPLICATION_API_PATH.APPLICATIONS,
        axiosConfig: {
          params: {
            limit: 10
          }
        },
        customAxiosInstance: axiosFSI
      })
      dispatch({
        type: GET_APPLICATIONS_SUCCESS,
        payload: {
          applications: data.Items
        }
      })
    } catch (e) {
      dispatch({
        type: GET_APPLICATIONS_FAILURE
      })
    }
  }
}
