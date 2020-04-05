//getting the data
let data =d3.json('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/d9178a6f0a5d7e6ead806da0844dae0ea664fc73/world.json').then(geojson=>{
// setup svg properties 
let width = 960,height=610; 
//appending svg 
let svg = d3.select('body').append('svg').attr('width',width).attr('height',height).style('background','#f4f4f4');
//setup map projection
let projection = d3.geoMercator();
//setup path
let path = d3.geoPath().projection(projection); 
//setup svg groups 
let states = svg.append('g').attr('id','states');
let circles = svg.append('g').attr('id','circles');
let labels = svg.append('g').attr('id','labels');
//binding states 
states.selectAll('path').data(geojson.features).join('path').attr('d',path).attr('fill','grey');
//setup the scale factor 
let scalefactor =0.005 ; 
//making bubbles
d3.csv('https://gist.githubusercontent.com/Mohab25/e5bd73def0a6ba0a3a4fdf34e395bf7b/raw/d9178a6f0a5d7e6ead806da0844dae0ea664fc73/conf.txt').then(csv=>{
    // adjust projection 
    projection.fitExtent([[0,0],[width,height]],geojson); 
    // bind circles
    circles.selectAll('circle').data(csv).join('circle')
    .attr('cx',d=>{return projection([+d["Long"],+d["Lat"]])[0]}).attr('cy',d=>{return projection([+d["Long"],+d["Lat"]])[1]})
    .attr('r',d=>{ return (+d["1/26/2020"])*scalefactor;}).attr('fill','red').style('opacity','0.5'); 

//setup labels 
    /*
    labels.selectAll("labels").data(csv).join("text")
      .attr("x", function(d, i) { return projection([+d["Long"],+d["Lat"]])[0]; })
      .attr("y", function(d, i) { return projection([+d["Long"],+d["Lat"]])[1]; })
      .attr("dy", "0.3em").attr("text-anchor", "middle")
      .text(d=>{return d['1/26/2020']==0?"":d['1/26/2020']});
        */
// setting up dates
let min_date = Date.parse('01/22/2020'), max_date = Date.parse('02/25/2020'); initial_date = Date.parse('01/26/2020');
//set the slider values
//setup the slider 
let body = document.getElementsByTagName('body')[0];
let slider = document.createElement('input'); slider.type="range";slider.min= min_date;slider.max=max_date;
slider.value=initial_date; slider.id="slider"; slider.setp= 86400000; //these dates are converted to milliseconds and reconstructed as dates again. setting the step, one day = 86400000 (86 million, 400 thousands milliseconds)
//getting the value of the range slider when it's changed :
slider.addEventListener('input',function(){ let day = this.value;redraw(day);});  
// bind slider 
body.appendChild(slider);
//redraw function for resetting the width of circles. 
let redraw = (milli)=>{
    // here the parameter should be parsed into date, and passed to the incoming csv data . 
    let d = new Date(+milli); //+ to convert the string milliseconds to number. 
    console.log(d.toLocaleDateString());
    let day = d.toLocaleDateString();  
    // redraw circles 
    circles.selectAll('circle').attr('r',function(d) { return (+d[day]*scalefactor);});
    // redraw labels 
    //labels.selectAll("text").text(function(d) { return d[day]==0?"":d[day]});
}
});
});
