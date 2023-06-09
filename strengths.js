// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 200, left: 80},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg0 = d3.select("#strength")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg0_sum = d3.select("#sum_str")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Parse the Data
d3.csv("Strength AnalysisData.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    console.log("data: ", data2)
    sessionStorage.origcount_S = data2.length;
    console.log("keys cnt: ", sessionStorage.origcount_S)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]
    // console.log(names)

    var stored = []
    if (sessionStorage.submitcount_S){
        for(var i=1; i < +sessionStorage.submitcount_S+1; i++){
            const str = sessionStorage.getItem("S"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            console.log("parsed OBJs: ", parsedobj)
        }
        console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    console.log("data2: ", data)

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

    sessionStorage.origin_s = a
    console.log(a)

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
        });


    // List of subgroups = header of the csv files = soil condition here
    var subgroups = rows

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = names
    
    // draw graph initially
    redrawS("linear")

    //radio button
    d3.selectAll(("input[name='scaleS']")).on("change", function() {
        // console.log(this.value)
        redrawS(this.value)
    });

    drawSumS()

    function drawSumS(){
        svg0_sum.selectAll("*").remove();

        var sum_data = []
        for(let i = 0; i < names.length; i++) {
            var sum = {}
            var total = 0
            sum["name"] = names[i];
            for(let j = 0; j < rows.length; j++){
                total = total + +data[j][names[i]]
            }
            sum['value'] = total
            sum_data.push(sum)
        }
        // console.log('sum data:', sum_data)
        
        max_val = d3.max(sum_data, function(d){return d['value']})
        // console.log('max:', max_val)

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max_val*1.1])
            .range([ height, 0 ]);
        svg0_sum.append("g")
                .call(d3.axisLeft(y));
        svg0_sum.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -margin.top)
            .text("Value in Currency ($)");

        // color palette = one color
        var colors = ['#000000']
        var color = d3.scaleOrdinal()
                .domain(groups)
                .range(colors)


        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(sum_data.map(function(d) { return d.name; }))
        .padding(0.2);
        svg0_sum.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Bars
        svg0_sum.selectAll("mybar")
        .data(sum_data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d['name']); })
        .attr("width", x.bandwidth())
        .attr("fill", "#000000")
        .attr("height", function(d) { return height - y(0); }) // always equal to 0
        .attr("y", function(d) { return y(0); })
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .delay(function(d,i){ return(i*100)});
        

    }
    function redrawS(s) {
        svg0.selectAll("*").remove();
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg0.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-50)")
            .style("text-anchor", "end");

        max_val = d3.max(data, function(d){return d["EST. VALUE IN CURRENCY"]})

        // Add Y axis
        if (s == 'linear'){
            var y = d3.scaleLinear()
                .domain([0, max_val*1.1])
                .range([ height, 0 ]);
            svg0.append("g")
                    .call(d3.axisLeft(y));
            svg0.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+20)
                .attr("x", -margin.top)
                .text("Value in Currency ($)");
        }
        else if(s == 'log'){
            var y = d3.scaleLog()
                .base(2)
                .domain([1, max_val*1.1])
                .range([ height, 0 ]);
            svg0.append("g")
                .call(d3.axisLeft(y));
            svg0.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -margin.top)
            .text("Value in Currency ($)")
        }
        
        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()]) 
                    .padding([0.05])

        // color palette = one color per subgroup
        var colors = ['#e41a1c','#377eb8','#4daf4a', '#8820da', '#dede43', '#71f3ba']
        var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(colors)

        // Show the bars
        svg0.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(a)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return xSubgroup(d.key); })
            .attr("width", xSubgroup.bandwidth())
            .attr("fill", function(d) { return color(d.key); })
            .attr("height", function(d) { return height - y(1); }) // always equal to 0
            .attr("y", function(d) { return y(1); })
            .transition()
            .duration(500)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .delay(function(d,i){ return(i*100)});
            
            var legendElement = svg0.append("g")
                            .attr("class", "legend__container")
                            .attr("transform", `translate(${width/4}, ${margin.top-90})`) // set our group position to the end of the chart
                            .selectAll("g.legend__element")
                            .data(xSubgroup.domain()) // use the scale domain as data
                            .enter()
                            .append("g")
                            .attr("transform", function(d, i) {
                                return `translate(0, ${i * 15})`; // provide an offset for each element found in the domain
                            });

            legendElement.append("text")
                .attr("x", 15)
                .attr("font-size", "14px")
                .text(d => d);

            legendElement.append("rect")
                    .attr("x", 0)
                    .attr("y", -10)
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", function(d, i) {
                        return colors[i%colors.length]; // use the same category color that we previously used in rects
                    });
        
            }
    })