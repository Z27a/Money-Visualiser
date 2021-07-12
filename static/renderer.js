const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here
const createScene = function () {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 100; //Mouse wheel speed

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));


    BABYLON.SceneLoader.ImportMesh("", "/static/", "100DollarNote.glb", scene, function (meshes){
        meshes[0].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        meshes[0].position.y = 0.5

        for (let i = 0; i < repeatAmount; i++){
            clonemesh = meshes[0].clone("clonemesh")
            clonemesh.position.z = i * 3
        }
        meshes[0].dispose();

    });

    var helper = scene.createDefaultEnvironment({
        enableGroundMirror: true,
        groundShadowLevel: 0.6,
    });

    helper.setMainColor(BABYLON.Color3.Teal());

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
