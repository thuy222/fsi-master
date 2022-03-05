
const EXTERNAL_APP_KEY = {
  FSA: '76c598a7-f861-4c95-b195-c15bef51d56f',
  FDI: 'e5db9223-57ef-4ad3-8710-55a7119d34c4',
  FSV: 'f0753d15-3ea9-45c6-893d-90597a706c67',
  FSX: 'e0121d0b-110e-4e3b-96d3-fcb74d616654'
}

/**
 * function getAppNameToDislay
 * 1. For the internal apps, keep the short format name
 * 2. Only FSA, FDI, FSV and FSX (client facing apps) need to show full name.
 */
export const getAppNameToDislay = (appInfo) => {
  if (appInfo?.key) {
    if (appInfo.key === EXTERNAL_APP_KEY.FSA ||
    appInfo.key === EXTERNAL_APP_KEY.FDI ||
    appInfo.key === EXTERNAL_APP_KEY.FSV ||
    appInfo.key === EXTERNAL_APP_KEY.FSX) {
      return appInfo.fullName
    }
    return appInfo.shortName
  }
}
