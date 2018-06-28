var fs = require('fs');
require('paper');
var paper = require('paper-jsdom');


fs.readFile("C:\\Users\\Jack\\Documents\\Projects\\paperjs\\myImage.svg", (err, data) =>{

    if(err) console.error(err);
    console.log("Loaded:\n" + data);
    paper.install(this);
    paper.setup([640,480]);
    
    var project = paper.project;
    var layer = project.addLayer(new paper.Layer());
    layer.activate();
    
    layer.importJSON(data.toJSON());
    
    console.log(layer);
});
