//Author-codefoster
//Description-

function createNewComponent(rootComp) {
    var allOccs = rootComp.occurrences;
    var newOcc = allOccs.addNewComponent(adsk.core.Matrix3D.create());
    return newOcc.component;
}

function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var startTime = new Date();
    var grid = [3, 3];
    var ui;
    try {

        var app = adsk.core.Application.get();
        var ui = app.userInterface;

        var design = adsk.fusion.Design.cast(app.activeProduct);

        // Have a body selected.
        var selection = ui.selectEntity('Select a body', 'Bodies');
        var body = (selection ? adsk.fusion.BRepBody.cast(selection.entity) : null);

        var b, entities;
        var box = body.boundingBox;
        var distance = { x: box.maxPoint.x - box.minPoint.x, y: box.maxPoint.y - box.minPoint.y };
        var zRange = distance.x * 0.75; //this is the range used for the random z position
        

        for (var i = 0; i < grid[0]; i++) {
            for (var j = 0; j < grid[1]; j++) {
                if (i == 0 && j == 0) continue;
                // # Copy the body to the root component.
                var b = body.copyToComponent(design.rootComponent);

                entities = adsk.core.ObjectCollection.create();
                entities.add(b);
                var transformation = adsk.core.Matrix3D.create();
                transformation.translation = adsk.core.Vector3D.create(distance.x * i, distance.y * j, Math.random() * zRange);
                
                var moveInput = design.rootComponent.features.moveFeatures.createInput(entities, transformation);
                design.rootComponent.features.moveFeatures.add(moveInput);
            }
        }
        
        console.log(new Date() - startTime);

    }
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }

    adsk.terminate();
}
