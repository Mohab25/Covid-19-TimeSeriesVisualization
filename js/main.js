//getting the data
                    
let data =d3.json('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/86afac3ec3b897ac9f010a60e85ce6e9e5668b29/world.json').then(geojson=>{
    d3.csv('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/be276ebb47d421aa713032e479914874ec1560cb/conf.txt').then(csv=>{
// setup svg properties 
let width = 660,height=610; 
//appending svg 
let svg = d3.select('body').append('svg').attr('width',width).attr('height',height).attr('class','svg1'); 
//setup map projection
let projection = d3.geoMercator();
projection.fitExtent([[0,0],[width,height]],geojson); 
let scalefactor =0.005 ; 
//setup path
let path = d3.geoPath().projection(projection); 
//setup svg groups 
let states = svg.append('g').attr('id','states');
let circles = svg.append('g').attr('id','circles');
//let labels = svg2.append('g').attr('class','labels');
// setup colorscale 
let arr23 = []; csv.forEach(d=>{arr23.push(+d['1/22/2020'])}); 
console.log(arr23);
let colorScale = d3.scaleQuantile().domain([0,10,20,50,100,200,500,800,1000]).range(d3.schemePuRd[9]);  
// setup mapObject 
let mapO = d3.map(); 
csv.forEach(d=>{
        if (mapO.keys().includes(d['Country/Region'])){
            mapO.set(d['Country/Region'],mapO.get(d['Country/Region'])+parseInt(d['1/22/2020']))
        }
        else mapO.set(d['Country/Region'],+d['1/22/2020']) 
}); 
//console.log(mapO);  // this probelm with csv was a country would be duplicated according to it's states, thus the map object would recive different keys with the same name which cause it to adopt the last instance only.                        
//binding states 
states.selectAll('path').data(geojson.features).join('path').attr('d',path)
.attr('fill',d=>{let elem = d.properties.name;console.log(mapO.get(elem));return colorScale(mapO.get(elem)==undefined?0:mapO.get(elem))});
console.log(mapO);
//setup labels 
    /*
    labels.selectAll("labels").data(csv).enter().append("text")
      .attr("x", function(d, i) { return projection([+d["Long"],+d["Lat"]])[0]; })
      .attr("y", function(d, i) { return projection([+d["Long"],+d["Lat"]])[1]; })
      .attr("dy", "0.3em").attr("text-anchor", "middle")
      .text(d=>{return d['1/26/2020']==0?"":d['1/26/2020']});
        */

//setup Horizontal bars
        // scvg 
        let new_svg = d3.select('body').append('svg').attr('class','new_svg').attr('width',500).attr('height',500).style('margin-top','20px');
        let margin={'top':20,buttom:20,right:40,left:40}; 
        // data 
        let top_ten_countries = ['China','Italy','Spain','Germany','Iran','France','US','South Korea','Switzerland','England'];   
        // scales  
        x_scale = d3.scaleLinear().domain([0,550]).range([0,400]); 
        y_scale = d3.scaleBand().domain(top_ten_countries).range([0,200]);
        // group
        let g_bars=new_svg.append('g').attr('class','bars');
        // rects
        g_bars.selectAll('rect').data(top_ten_countries).enter().append('rect')
        .attr('width',d=>{console.log(x_scale(mapO.get(d)==undefined?0:mapO.get(d)));return x_scale(mapO.get(d)==undefined?0:mapO.get(d))}).attr('height',15).attr('x',50)
        .attr('y',(d,i)=>{return i*40}).attr('fill','steelblue');
        // text
        g_bars.selectAll('text').data(top_ten_countries).enter().append('text').attr('x',d=>{if(mapO.get(d)<70){return 70} else return (x_scale(mapO.get(d))+60)}).attr('y',(d,i)=>{return (i+1)*20}).text(d=>{return mapO.get(d)}).attr('dy','-0.3em');
        // axis 
        new_svg.append('g').attr('class','y_axis_group').call(d3.axisRight(y_scale)).select('.domain').remove(); 
    
// setting up dates
let min_date = Date.parse('01/22/2020'), max_date = Date.parse('03/23/2020'); initial_date = Date.parse('01/22/2020');
//set the slider values
//setup the slider 
let slide_div = document.getElementById('slider');
let slider = document.createElement('input'); slider.type="range";slider.min= min_date;slider.max=max_date;
slider.value=initial_date; slider.id="slider"; slider.setp= 864000000; slider.class="range-field"; //these dates are converted to milliseconds and reconstructed as dates again. setting the step, one day = 86400000 (86 million, 400 thousands milliseconds)
slider.name="slider";
let bubble = document.createElement('output');bubble.for='slider';bubble.id="bubble"; 
//getting the value of the range slider when it's changed :
slider.addEventListener('input',function(){ let day = this.value;redraw(day)});  
// bind slider 
slide_div.appendChild(slider);slide_div.appendChild(bubble);
// slider output 
//redraw function for resetting the width of circles. 
let redraw = (milli)=>{
    // here the parameter should be parsed into date, and passed to the incoming csv data . 
    let d = new Date(+milli); //+ to convert the string milliseconds to number. 
    //console.log(d.toLocaleDateString());
    let day = d.toLocaleDateString();  
    // redraw colors 
        let new_mapO = d3.map(); 
        csv.forEach(d=>{
                if (new_mapO.keys().includes(d['Country/Region'])){
                    if(isNaN(parseInt(d[day]))){new_mapO.set(d['Country/Region'],new_mapO.get(d['Country/Region'])+0)}
                    else new_mapO.set(d['Country/Region'],new_mapO.get(d['Country/Region'])+parseInt(d[day]));
                    
                }
                else new_mapO.set(d['Country/Region'],+parseInt(d[day])) 
        }); 
        console.log(d3.max(new_mapO.values()));
        states.selectAll('path').data(geojson.features).join('path').attr('d',path)
        .attr('fill',d=>{let elem = d.properties.name;return colorScale(new_mapO.get(elem)==undefined?0:new_mapO.get(elem))});
    // redraw labels 
    //labels.selectAll("text").text(function(d) { return d[day]==0?"":d[day]});
        console.log(new_mapO);
    // set bubble 
    bubble.innerHTML =day; 
    // chart
    let new_x_scale = d3.scaleLinear().domain([0,d3.max(new_mapO.values())]).range([0,400]); 
    console.log(new_x_scale.domain());
        // group
        //let g_bars=new_svg.append('g').attr('class','bars');
        // rects
        g_bars.selectAll('rect')
        .attr('width',d=>{console.log("#####",new_x_scale(new_mapO.get(d)==undefined?0:new_mapO.get(d)));return new_x_scale(new_mapO.get(d)==undefined?0:new_mapO.get(d))}).attr('height',15).attr('x',50)
        .attr('y',(d,i)=>{return i*20}).attr('fill','steelblue');
        // text
        g_bars.selectAll('text').data(top_ten_countries).attr('x',d=>{if(new_mapO.get(d)<70){return 70} else return (new_x_scale(new_mapO.get(d))+60)}).attr('y',(d,i)=>{return (i+1)*20}).text(d=>{return new_mapO.get(d)}).attr('dy','-0.3em');
        // axis 
       // new_svg.append('g').attr('class','y_axis_group').call(d3.axisRight(y_scale)).select('.domain').remove(); 
    
}
});
});
