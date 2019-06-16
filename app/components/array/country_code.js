const country_code = {
FR:'France',
IT:'Italie'
}
function getCountryCode(country){
  for (var i in country_code){
    if (country_code[i] == country) return i
  }
}
export {country_code,getCountryCode}
