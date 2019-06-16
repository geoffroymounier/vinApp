import alasql from 'alasql'
import raw from './raw'

let j = 1
function regionArray(appelation = null){

  const regionsFR =  alasql('SELECT * FROM ? WHERE   (country = "France" ' + ((appelation) ? 'AND appelation = "' + appelation + '" ' :'') + ') GROUP BY region ORDER BY region ASC ' ,[raw])
  const regionsNOFR = alasql('SELECT * FROM ? WHERE (country != "France" ' + ((appelation) ? 'AND appelation = "' + appelation + '" ' :'') + ') GROUP BY country,region ORDER BY country,region ASC',[raw])
  let array = []

  for (var i in regionsFR){
      if (regionsFR[i].region && (i == 0 ||regionsFR[i-1].country_code != regionsFR[i].country_code)){
        array.push({
          label : (regionsFR[i] || '').country.toUpperCase(),
          value : (regionsFR[i] || '').country.toUpperCase(),
          country : (regionsFR[i] || '').country,
          colors : (regionsFR[i] || '').colors ||'',
          country_code : (regionsFR[i] || '').country_code.toUpperCase(),
          key:j
        })
        j++
        array.push({
          label : (regionsFR[i] || '').region,
          value : (regionsFR[i] || '').region,
          country : (regionsFR[i] || '').country,
          colors : (regionsFR[i] || '').colors ||'',
          country_code : (regionsFR[i] || '').country_code.toUpperCase(),
          key:j
        })
      } else if (regionsFR[i].region){

        array.push({
          label : (regionsFR[i] || '').region || '',
          value : (regionsFR[i] || '').region || '',
          colors : (regionsFR[i] || '').colors ||'',
          country : (regionsFR[i] || '').country,
          country_code : (regionsFR[i] || '').country_code.toUpperCase(),
          key:j
        })
        j++
      }

  }
  for (var i in regionsNOFR){

      if (regionsNOFR[i].region && (i == 0 || regionsNOFR[i-1].country_code != regionsNOFR[i].country_code)){
        array.push({
          label : (regionsNOFR[i] || '').country.toUpperCase(),
          value : (regionsNOFR[i] || '').country.toUpperCase(),
          country : (regionsNOFR[i] || '').country,
          colors : (regionsNOFR[i] || '').colors ||'',
          country_code : (regionsNOFR[i] || '').country_code.toUpperCase(),
          key:j
        })
        j++
        array.push({
          label : (regionsNOFR[i] || '').region,
          value : (regionsNOFR[i] || '').region,
          country : (regionsNOFR[i] || '').country,
          colors : (regionsNOFR[i] || '').colors ||'',
          country_code : (regionsNOFR[i] || '').country_code.toUpperCase(),
          key:j
        })
      } else if (regionsNOFR[i].region){

        array.push({
          label : (regionsNOFR[i] || '').region || '',
          value : (regionsNOFR[i] || '').region || '',
          colors : (regionsNOFR[i] || '').colors ||'',
          country : (regionsNOFR[i] || '').country,
          country_code : (regionsNOFR[i] || '').country_code.toUpperCase(),
          key:j
        })
        j++
      }

  }
  return array
}

export default regionArray
