d3.csv("Strength AnalysisData.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    var sum_data_S = []
    // console.log("data: ", data2)
    // sessionStorage.origcount_S = data2.length;
    // console.log("keys cnt: ", sessionStorage.origcount_S)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]

    console.log("NAMES:", names)

    var stored = []
    if (sessionStorage.submitcount_S){
        for(var i=1; i < +sessionStorage.submitcount_S+1; i++){
            const str = sessionStorage.getItem("S"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            // console.log("parsed OBJs: ", parsedobj)
        }
        // console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    // console.log("data2: ", data)

    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
    });

    for(let i = 0; i < names.length; i++) {
        var sum = {}
        var total = 0
        sum["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            total = total + +data[j][names[i]]
        }
        sum['value'] = total
        sum_data_S.push(sum)
    }

    const jsonobj = JSON.stringify(sum_data_S)
    sessionStorage.setItem("sum_data_S", jsonobj)
})

d3.csv("Weakness Analysis Data.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    var sum_data_W = []
    // console.log("data: ", data2)
    // sessionStorage.origcount_W = data2.length;
    // console.log("keys cnt: ", sessionStorage.origcount_S)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]
    // console.log(names)

    var stored = []
    if (sessionStorage.submitcount_W){
        for(var i=1; i < +sessionStorage.submitcount_W+1; i++){
            const str = sessionStorage.getItem("W"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            // console.log("parsed OBJs: ", parsedobj)
        }
        // console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    // console.log("data2: ", data)

    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
    });

    for(let i = 0; i < names.length; i++) {
        var sum = {}
        var total = 0
        sum["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            total = total + +data[j][names[i]]
        }
        sum['value'] = total
        sum_data_W.push(sum)
    }
    const jsonobj = JSON.stringify(sum_data_W)
    sessionStorage.setItem("sum_data_W", jsonobj)
})

d3.csv("Opportunity Analysis Data.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    var sum_data_O = []
    // console.log("data: ", data2)
    // sessionStorage.origcount_S = data2.length;
    // console.log("keys cnt: ", sessionStorage.origcount_S)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]
    // console.log(names)

    var stored = []
    if (sessionStorage.submitcount_O){
        for(var i=1; i < +sessionStorage.submitcount_S+1; i++){
            const str = sessionStorage.getItem("O"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            // console.log("parsed OBJs: ", parsedobj)
        }
        // console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    // console.log("data2: ", data)

    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
    });

    for(let i = 0; i < names.length; i++) {
        var sum = {}
        var total = 0
        sum["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            total = total + +data[j][names[i]]
        }
        sum['value'] = total
        sum_data_O.push(sum)
    }
    const jsonobj = JSON.stringify(sum_data_O)
    sessionStorage.setItem("sum_data_O", jsonobj)
})

d3.csv("Threat Analysis Data.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    var sum_data_T = []
    // console.log("data: ", data2)
    // sessionStorage.origcount_W = data2.length;
    // console.log("keys cnt: ", sessionStorage.origcount_S)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]
    // console.log(names)

    var stored = []
    if (sessionStorage.submitcount_T){
        for(var i=1; i < +sessionStorage.submitcount_T+1; i++){
            const str = sessionStorage.getItem("T"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            // console.log("parsed OBJs: ", parsedobj)
        }
        // console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    // console.log("data2: ", data)

    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
    });

    for(let i = 0; i < names.length; i++) {
        var sum = {}
        var total = 0
        sum["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            total = total + +data[j][names[i]]
        }
        sum['value'] = total
        sum_data_T.push(sum)
    }
    const jsonobj = JSON.stringify(sum_data_T)
    sessionStorage.setItem("sum_data_T", jsonobj)
})
