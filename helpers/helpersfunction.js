


const dateFormat = (value) => {

    day = value.substring(0,2)
    month= value.substring(3,4)
    year = value.substring(5,9)
    hour = value.substring(11,12)
    minute = value.substring(13,15)
    seconds = value.substring(16,18)

  
    // const p = value.replace(/p./g,"")
    // const pm = p.replace(/m./g,"");
    // const ount = pm.replace(/:/g,"")
    // const coma = ount.replace(/,/,"")
    // const slash = coma.replace('/',"")
    // const slash2 = slash.replace('/',"")
    // const space = slash2.replace(' ',"")
    // const date = space.trim()
    const date = year+month+day+hour+minute+seconds
    return parseInt(date)
}


module.exports ={
    dateFormat
}