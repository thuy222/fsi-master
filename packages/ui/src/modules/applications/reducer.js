import {
  GET_APPLICATIONS_SUCCESS,
  GET_PROFILE_IFRAME_SOURCE,
} from './action-type'

const initialState = {
  applications: [],
  source: '',
}

export default (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
    case GET_APPLICATIONS_SUCCESS:
      return {
        ...state,
        applications: payload.applications,
      }
    case GET_PROFILE_IFRAME_SOURCE:
      return {
        ...state,
        source: payload.source,
      }
    default:
      return state
  }
}
