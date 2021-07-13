const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const floor = Math.floor

var cash = 9999
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


    // Imports 100DollarStack from static folder
    BABYLON.SceneLoader.ImportMesh("", "/static/", "100DollarStack.glb", scene, function (Stack100){
        for (let i = 0; i < objNumber1000; i++) {
            NewObj = Stack100[0].clone("NewObj")
            NewObj.position.x = 0
            NewObj.position.y = 1
            NewObj.position.z = i * 0.1
            // Sets 1000 dollar note to cast shadows
            shadowGenerator.addShadowCaster(NewObj);
        }
        Stack100[0].dispose();

    });


    // Imports 100DollarNote from static folder
    BABYLON.SceneLoader.ImportMesh("", "/static/", "100DollarNote.glb", scene, function (Note100){
        //array
        for (let i = 0; i < objNumber100; i++) {
            NewObj = Note100[0].clone("NewObj")
            NewObj.position.x = 0.2
            NewObj.position.y = 1
            NewObj.position.z = i * 0.1
            // Sets 100 dollar note to cast shadows
            shadowGenerator.addShadowCaster(NewObj);
        }
        Note100[0].dispose();




    });




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
