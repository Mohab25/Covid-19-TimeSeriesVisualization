// setup the properties 
let width = 1200,height=500; 
//appending svg 
let svg = d3.select('body').append('svg').attr('width',width).attr('height',height).style('background','#f4f4f4');
//setup map projection
let projection = d3.geoEquirectangular().scale(200);
//setup path
let path = d3.geoPath().projection(projection); 
//setup svg groups 
let states = svg.append('g').attr('id','states');
let circles = svg.append('g').attr('id','circles');
let labels = svg.append('g').attr('id','labels');
//getting the data
let data =d3.json('https://github.com/Mohab25/Covid-19-TimeSeriesVisualization/blob/master/data/world.json').then(d=>{console.log(d);
states.selectAll('path').data(d.features).enter().append('path').attr('fill','#d3d3d3').attr('d',path).style('stroke','#fff');
});
//setup the scale factor 
let scalefactor =1./190. ; 
//making bubbles
d3.csv('https://github.com/Mohab25/Covid-19-TimeSeriesVisualization/blob/master/data/conf.txt').then(csv=>{

    circles.selectAll('circle').data(csv).enter().append('circle')
    .attr('cx',d=>{return projection([+d["Long"],+d["Lat"]])[0]}).attr('cy',d=>{return projection([+d["Long"],+d["Lat"]])[1]})
    .attr('r',d=>{ return (+d["1/26/2020"])*scalefactor;}).attr('fill','red').style('opacity','0.6'); 

//setup labels
    /*
    labels.selectAll("labels").data(csv).enter().append("svg:text")
      .attr("x", function(d, i) { return projection([+d["Long"],+d["Lat"]])[0]; })
      .attr("y", function(d, i) { return projection([+d["Long"],+d["Lat"]])[1]; })
      .attr("dy", "0.3em").attr("text-anchor", "middle")
.text(function(d) {});*/
});
//setup the slider 
// setting up dates
let min_date = Date.parse('01/22/2020'), max_date = Date.parse('02/25/2020'); initial_date = Date.parse('01/26/2020');
//set the slider values
let slider = document.getElementById('slider'); slider.min = min_date;slider.max=max_date ; slider.value=initial_date;   //these dates are converted to milliseconds and reconstructed as dates again. 
//setting the step, one day = 86400000 (86 million, 400 thousands milliseconds)
slider.step = 86400000; 
//getting the value of the range slider when it's changed :
slider.addEventListener('input',function(){ let day = this.value;redraw(day);});  
//redraw function for resetting the width of circles. 
let redraw = (milli)=>{
    // here the parameter should be parsed into date, and passed to the incoming csv data . 
    let d = new Date(+milli); //+ to convert the string milliseconds to number. 
    console.log(d.toLocaleDateString());
    let day = d.toLocaleDateString();  
    circles.selectAll('circle').attr('r',function(d) { return (+d[day]*scalefactor);});
    //labels.selectAll("text").text(function(d) { return Math.round(d[day]); });
}
