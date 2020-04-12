//getting the data
                    
let data =d3.json('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/86afac3ec3b897ac9f010a60e85ce6e9e5668b29/world.json').then(geojson=>{
    d3.csv('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/b5cbdf3dfd61734a29f61561c3890748e8b20f7b/conf.txt').then(csv=>{
// setup svg properties 
let width = 960,height=610; 
//appending svg 
let svg = d3.select('div#first_map').append('svg').attr('width',width).attr('height',height); 
let svg2 = d3.select('div#sec_map').append('svg').attr('width',width).attr('height',height);
//setup map projection
let projection = d3.geoMercator();
projection.fitExtent([[0,0],[width,height]],geojson); 
let scalefactor =0.005 ; 
//setup path
let path = d3.geoPath().projection(projection); 
//setup svg groups 
let states = svg.append('g').attr('id','states');
let circles = svg.append('g').attr('id','circles');
let labels = svg.append('g').attr('id','labels');
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
.attr('fill',d=>{let elem = d.properties.name;return colorScale(mapO.get(elem)==undefined?0:mapO.get(elem))});

//setup labels 
    /*
    labels.selectAll("labels").data(csv).join("text")
      .attr("x", function(d, i) { return projection([+d["Long"],+d["Lat"]])[0]; })
      .attr("y", function(d, i) { return projection([+d["Long"],+d["Lat"]])[1]; })
      .attr("dy", "0.3em").attr("text-anchor", "middle")
      .text(d=>{return d['1/26/2020']==0?"":d['1/26/2020']});
        */
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
                    new_mapO.set(d['Country/Region'],new_mapO.get(d['Country/Region'])+parseInt(d[day]));
                    console.log(day);
                }
                else new_mapO.set(d['Country/Region'],+parseInt(d[day])) 
        }); 
        states.selectAll('path').data(geojson.features).join('path').attr('d',path)
        .attr('fill',d=>{let elem = d.properties.name;return colorScale(new_mapO.get(elem)==undefined?0:new_mapO.get(elem))});
    // redraw labels 
    //labels.selectAll("text").text(function(d) { return d[day]==0?"":d[day]});

    // set bubble 
    bubble.innerHTML =day; 
}
});
});
