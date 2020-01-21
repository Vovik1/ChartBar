const url = 'http://127.0.0.1:5000/api/v1/data/';
const svg = d3.select("#chart");


const render = data => {
    
	const margin = {top: 35, left: 35, bottom: 0, right: 0};
	const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    
    const keys = Object.keys(data[0]).slice(1,Object.keys(data[0]).length);
    const colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"];
    
    const legendRectSize = 18;                                 
    const legendSpacing = 4;


    const x = d3.scaleBand()
		.range([margin.left, width - margin.right])
        .padding(0.1);
        
    const y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top]);

    const xAxis = svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis")

	const yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis")

	const z = d3.scaleOrdinal()
		.range(colors)
        .domain(keys);

    data.forEach(function(d) {
		d.total = d3.sum(keys, k => +d[k])
		return d
    })

    y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

    svg.selectAll(".y-axis")
            .call(d3.axisLeft(y).ticks(null, "s"))

    x.domain(data.map(d => d.timestamp));

    svg.selectAll(".x-axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));    

    const group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)
        
    group.enter().append("g")
		.classed("layer", true)
		.attr("fill", d => z(d.key));

	const bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.timestamp);
            
    bars.enter().append("rect")
		.attr("width", x.bandwidth())
        .merge(bars)
		.attr("x", d => x(d.data.timestamp))
		.attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          let xPosition = d3.mouse(this)[0] - 15;
          let yPosition = d3.mouse(this)[1] - 25;          
          tooltip.attr("transform", `translate(${xPosition}, ${yPosition})`);
          tooltip.select("text").text(d[1]-d[0]);
        });
            
    const text = svg.selectAll(".text")
		.data(data, d => d.timestamp);

    text.enter().append("text")
		.attr("class", "text")
		.attr("text-anchor", "middle")
		.merge(text)
		.attr("x", d => x(d.timestamp) + x.bandwidth() / 2)
		.attr("y", d => y(d.total) - 5)
        .text(d => d.total)


    const legend = svg.selectAll('.legend')                    
        .data(keys)                                   
        .enter()                                               
        .append('g')                                           
        .attr('class', 'legend')                               
        .attr('transform', (d, i) =>{ 
            const verticalOffset = 40;
            if (i==0){
                return `translate(${width}, ${verticalOffset})`;
            }
            else{
                let vert = (legendRectSize+legendSpacing) * i + verticalOffset;
                return `translate(${width}, ${vert})`;
            }
        });
    
  
    legend.append('rect')                                   
        .attr('width', legendRectSize)                          
        .attr('height', legendRectSize)                         
        .style('fill', (d,i)=>colors[i]);                                
    
    legend.append('text')                                     
        .attr('x', legendRectSize + legendSpacing)              
        .attr('y', legendRectSize - legendSpacing)              
        .text(function(d) { return d; });  

    const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
          
      tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "green")
        .style("opacity", 0.5);
        
      
      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
        
}

const getData = url => {
    let response = fetch(url)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        const arr = []
        for (timestr in data){
            const dataObj = {};
            dataObj.timestamp = timestr;
            dataObj.a = data[timestr].a;
            dataObj.b = data[timestr].b
            dataObj.c = data[timestr].c
            dataObj.d = data[timestr].d
            dataObj.e = data[timestr].e
            dataObj.f = data[timestr].f
            arr.push(dataObj);
        }
        return arr;
    });
    return response;
};


getData(url).then(data=>{
    render(data);
})

