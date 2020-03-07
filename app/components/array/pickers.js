import {regions,terrains,typologie} from './description'

function makeYearArray(){
  let i = 1950
  let years = [];
  while (i <= 2040){
    years.push({
      label: i.toString(),
      value: i,
      key:i
    })
    i++
  }
  return years;
}
function apogeeArray(){
  let i = 2018
  let years = [];
  while (i <= 2080){
    years.push({
      label: i.toString(),
      value: i,
      key:i
    })
    i++
  }
  return years;
}
function lastYearArray(){
  let i = 2018
  let years = [];
  while (i <= 2080){
    years.push({
      label: i.toString(),
      value: i,
      key:i
    })
    i++
  }
  return years;
}
function makeTypologieArray(){
  let array = []
  for (var i in typologie){
    array.push({
      label:typologie[i],
      value:i,
      key:i
    })
  }
  return array
}
function makeStockArray(){
  let i = 0
  let stock = [];
  while (i <= 100){
    stock.push({
      label: i.toString(),
      value: i,
      key:i
    })
    i++
  }
  return stock;
}
function makePriceArray(){
  let i = 0
  let stock = [];
  while (i <= 100){
    stock.push({
      label: i.toString() + ' €',
      value: i,
      key:i
    })
    i++
  }
  return stock;
}
function makeRegionArray(){
  let array = []
  for (var i in regions){
    array.push({
      label:regions[i],
      value:i,
      key:i
    })
  }
  return array
}
function terrainArray(){
  let array = []
  for (var i in terrains){
    array.push({
      label:terrains[i],
      value:i,
      key:i
    })
  }
  return array
}
function carafageArray(){
  let array = []
  let colors = ['Aucun','10 min','20 min','30 min','45 min','1h','1h30','2h','3h']
  for (var i in colors){
    array.push({
      label:colors[i],
      value:i,
      key:i
    })
  }
  return array
}
function temperatureArray(){
  let array = []
  let temperature = 8
  let i = 0
  while (temperature <= 18){
    array.push({
      label:(temperature.toString() + " °C").replace(/\./,','),
      value:i.toString(),
      key:i
    })
    temperature = temperature+0.5
    i++
  }
  return array
}
export {temperatureArray,carafageArray,makeTypologieArray,makeRegionArray,makeStockArray,makePriceArray,makeYearArray,lastYearArray,terrainArray,apogeeArray}
