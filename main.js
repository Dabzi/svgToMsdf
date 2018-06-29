var fs = require('fs');
require('paper-jsdom');
var paper = require('paper');

paper.install(this);
//TODO canvas size should match input SVG!
paper.setup([640,480]);

fs.readFile("myImage.svg", (err, data) =>{

    if(err) console.error(err);
    
    var project = paper.project;
    var layer = project.addLayer(new paper.Layer());
    layer.activate();

    var item = layer.importSVG(data.toString());
    project.clear();
    paper.setup([item.bounds.width, item.bounds.height]);
    project = paper.project;

    layer = project.addLayer(new paper.Layer());
    layer.activate();
    item = layer.importSVG(data.toString()); //Reimport for now, but re-adding would be quicker.
    //Get the root element, which should tell us our bounding box
    var svgRoot = item.firstChild;
    
    var currentItem = svgRoot.nextSibling;
    while(currentItem){
        //Union of this + next sibling
        if(currentItem.nextSibling){
            currentItem = currentItem.unite(currentItem.nextSibling);
        }
        else{
            currentItem=null;
        }
    }

    var asSvg  = paper.project.exportSVG(true);
    console.log(asSvg.innerHTML);


    fs.writeFile("output.svg", asSvg.outerHTML, error => {
        if(error)console.error(error);
    }
    );
});
