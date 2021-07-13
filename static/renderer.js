const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const floor = Math.floor

// Calculate objNumber using cash value
objNumber1000 = floor(cash / 1000)
objNumber100 = floor(cash % 1000 / 100)
objNumber50 = floor(cash % 100 / 50)
objNumber20 = floor(cash % 50 / 20)
objNumber10 = floor(cash % 50 % 20 / 10)
objNumber5 = floor(cash % 10 / 5)
objNumber2 = floor(cash % 5 / 2)
objNumber1 = floor(cash % 5 % 2)

objNumber50c = floor(cash % 1 / 0.50)
objNumber20c = floor(cash % 0.50 / 0.20)
objNumber10c = floor(cash % 0.20 / 0.10)
objNumber5c = floor(cash % 0.10/ 0.05)
// total notes and coins
totalNotesNumber = objNumber1000 + objNumber100 + objNumber50 + objNumber20 + objNumber10 + objNumber5
totalCoinsNumber = objNumber50c + objNumber20c + objNumber10c + objNumber5c
//Find rows and columns of notes
NRow = 0
NCol = 0
HighestRemainder = 0

for (i = floor(Math.sqrt(totalNotesNumber)); i >= 1; i += -1) {
    if (totalNotesNumber / i <= 2 * i) {
        if (totalNotesNumber % i == 0) {
            NRow = i;
            break;
        }
        else if (totalNotesNumber/i - floor(totalNotesNumber/i ) > HighestRemainder) {
            HighestRemainder = (totalNotesNumber/i - floor(totalNotesNumber/i));
            NRow = i;
        }
    }
}
if (NRow > 0) {
    NCol = Math.ceil(totalNotesNumber / NRow);
}

// Write all your code in this function (Don't do anything outside of it)
const createScene = function () {
    // Initialise scene
    var scene = new BABYLON.Scene(engine);

    // Creates a camera
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 1000;
    camera.minZ = 0;

    // Creates a light
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(2, -5, 1));

    // Creates a shadow generator for the light
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.usePercentageCloserFiltering = true;

    // Function that arranges objects in a rectange. Requires model file, number of objects and offset.
    function renderObject(modelfile, objNumber, Row, Column, Offset) {
        BABYLON.SceneLoader.ImportMesh("", "/static/", modelfile, scene, function (model) {
            let k = 0;
            for (let i = Offset[0]; i < Row; i++) {
                for (let j = Offset[2]; j < Column; j++) {
                    if (k < objNumber) {
                        NewObj = model[0].clone("NewObj")
                        NewObj.position = new BABYLON.Vector3(i*0.2, 1, j * 0.2);

                        // Sets object to cast shadows
                        shadowGenerator.addShadowCaster(NewObj);
                        k++;
                        Offset = [0,0,0]
                    }
                    else {
                        model[0].dispose(); // Delete original object
                        CurrentPosition = [i * 0.2, 1 ,j * 0.2]
                        return CurrentPosition;
                    }
                }

            }
            model[0].dispose(); // Delete original object
            return CurrentPosition;
        });
    }
    //render objects

    CPos = renderObject("100DollarStack.glb",objNumber1000,NRow,NCol,[0,0,0])
    CPos = renderObject("100DollarNote.glb",objNumber100,NRow,NCol,CPos)
    CurrentPosition = renderObject("50DollarNote.glb",objNumber50,NRow,CPos)
    CurrentPosition = renderObject("20DollarNote.glb",objNumber20,NRow,NCol,CurrentPosition)
    CurrentPosition = renderObject("10DollarNote.glb",objNumber10,NRow,NCol,CurrentPosition)
    CurrentPosition = renderObject("5DollarNote.glb",objNumber5,NRow,NCol,CurrentPosition)
    CurrentPosition = renderObject("2DollarCoin.glb",objNumber2,2,1,[0,0,0])
    CurrentPosition = renderObject("1DollarCoin.glb",objNumber1,2,1,[0,0,0])


    // Creates environment box
    var envBox = scene.createDefaultEnvironment({
        // shadow opacity
        groundShadowLevel: 0.5,
    });
    envBox.setMainColor(new BABYLON.Color3(0.0429, 0.3375, 0.0479));

    return scene;
};


const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
