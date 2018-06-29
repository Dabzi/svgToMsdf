var fs = require('fs');
require('paper-jsdom');
var paper = require('paper');

paper.install(this);
//TODO canvas size should match input SVG!
paper.setup([640,480]);

fs.readFile("Freesample.svg", (err, data) =>{

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
    currentItem.fillColor=0x00000000;
    console.log("PATH: " + uniteAll(collectPaths(currentItem)));
    
    let unionLayer = new paper.Layer(currentItem);
    /*
    var compoundPath = new paper.CompoundPath(collectPaths(currentItem));
    compoundPath.fillColor=0x00000000;
    project.clear();
    project.activeLayer.addChild(compoundPath);
    console.log(compoundPath);*/

    var asSvg  = unionLayer.exportSVG(true);
    console.log(asSvg.innerHTML);


    fs.writeFile("output.svg", asSvg.outerHTML, error => {
        if(error)console.error(error);
    }
    );
});

function uniteAll(items){
    const filtered = items.filter(item => {
        console.log(item.className);
        return item.className=="Path" || item.className=="CompoundPath"
    });

    console.log("Before filter: " + items.length + " after: " + filtered.length);
    var rootItem = null;
    filtered.forEach(item => {
        if(rootItem==null) {
            rootItem=new paper.CompoundPath(item)
            return;
        }else{
            rootItem.unite(item);
        }
    });
    return rootItem;
    }
    

function collectPaths(item){
    let results = new Array();
    let currentItem = item;
    if(!item.children) return results;
    item.children.forEach(child => {
        results.push(child)
        nestedResults = collectPaths(child);
        if(nestedResults) nestedResults.forEach(child => results.push(child));
    });
    return results;
}
