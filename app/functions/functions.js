function checkData(object,toCompareWith){
  var bool = false

  for (var i in object){
    if (object[i] != null && (toCompareWith[i] != object[i] || typeof toCompareWith[i] == 'undefined')) bool = true
    else if (typeof object[i] == 'object') checkData(object[i],toCompareWith[i])

  }
  return bool
}

export {checkData}
