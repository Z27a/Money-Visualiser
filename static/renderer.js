const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Write all your code in this function (Don't do anything outside of it)
const createScene = function () {
    // Initialise scene
    var scene = new BABYLON.Scene(engine);

    // Creates a camera
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 5, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 1000;

    // Creates a light
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(2, -5, 1));

    // Creates a shadow generator for the light
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.usePercentageCloserFiltering = true;

    // Imports 100DollarNote from static folder
    BABYLON.SceneLoader.ImportMesh("", "/static/", "100DollarNote.glb", scene, function (Note100){
        // Sets height to 0.5
        Note100[0].position.y = 0.5
        // Sets 100 dollar note to cast shadows
        shadowGenerator.addShadowCaster(Note100[0]);

    });

    // Imports 100DollarStack from static folder
    BABYLON.SceneLoader.ImportMesh("", "/static/", "100DollarStack.glb", scene, function (Stack100){
        // Sets position to x=-1, y=2, z=0
        Stack100[0].position = new BABYLON.Vector3(-1, 2, 0)
        // Sets rotation to x-axis:0, y-axis:pi/3, z-axis:0
        Stack100[0].rotation = new BABYLON.Vector3(0, Math.PI / 3, 0);
        shadowGenerator.addShadowCaster(Stack100[0]);

    });


    // Creates environment box
    var envBox = scene.createDefaultEnvironment({
        // shadow opacity
        groundShadowLevel: 0.5,
    });
    envBox.setMainColor(BABYLON.Color3.Green());

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
