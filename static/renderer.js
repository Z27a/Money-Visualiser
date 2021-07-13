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

totalNotesNumber = objNumber1000 + objNumber100 + objNumber50 + objNumber20 + objNumber10 + objNumber5
totalCoinsNumber = objNumber50c + objNumber20c + objNumber10c + objNumber5c
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
    function renderObject(modelfile, objNumber, xOffset, yOffset, zOffset) {
        BABYLON.SceneLoader.ImportMesh("", "/static/", modelfile, scene, function (model) {
            for (let i = 0; i < objNumber; i++) {
                NewObj = model[0].clone("NewObj")
                NewObj.position.x = xOffset
                NewObj.position.y = yOffset
                NewObj.position.z = i * 0.1 + zOffset
                // Sets object to cast shadows
                shadowGenerator.addShadowCaster(NewObj);
            }
            model[0].dispose(); // Delete original object
        });
    }
    renderObject("100DollarStack.glb",objNumber1000,0,0,0)
    renderObject("100DollarNote.glb",objNumber100,0.2,0,0)
    renderObject("50DollarNote.glb",objNumber50,0.4,0,0)
    renderObject("20DollarNote.glb",objNumber20,0.6,0,0)
    renderObject("10DollarNote.glb",objNumber10,0.8,0,0)
    renderObject("5DollarNote.glb",objNumber5,1,0,0)
    renderObject("2DollarCoin.glb",objNumber2,0,0,-0.03)
    renderObject("1DollarCoin.glb",objNumber1,0,0,-0.02)


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
