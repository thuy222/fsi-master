
import geoip from 'geoip-lite'

const getLocationByIpAddress = (ip) => {
  console.log('ip', ip)
  const { country, city } = geoip.lookup(ip)
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  const countryName = country ? regionNames.of(country) : ''
  return {
    city,
    country: countryName
  }
}

export { getLocationByIpAddress }
