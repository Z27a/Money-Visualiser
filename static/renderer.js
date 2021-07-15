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
objNumber20c = floor(cash*100 % 50 / 20)
objNumber10c = floor(cash*100 % 20 / 10)
objNumber5c = floor(cash*100 % 10/ 5)

console.log(container)
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
    // Array of number of objects with corresponding 3D object file names
    const objNumber = [objNumber1000,objNumber100,objNumber50,objNumber20,objNumber10,objNumber5,objNumber2,objNumber1,objNumber50c,objNumber20c,objNumber10c,objNumber5c];

    const FileNames = ["100DollarStack.glb","100DollarNote.glb","50DollarNote.glb","20DollarNote.glb","10DollarNote.glb","5DollarNote.glb", "2DollarCoin.glb","1DollarCoin.glb","50CentCoin.glb","20CentCoin.glb","10CentCoin.glb","5CentCoin.glb"];

    const ContainerFile = ["trolley.glb","car.glb","house.glb"]

    var moneyArray = [];

    for (let l = 0; l < objNumber.length; l++) {
        if (objNumber[l] > 0) {
            moneyArray.push([FileNames[l], objNumber[l]])
        }
    }

    // Initialise scene
    var scene = new BABYLON.Scene(engine);

    // Creates a camera
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 2, new BABYLON.Vector3(0, 0.5, 0));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 500;
    camera.minZ = 0;

    // Creates a light
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(2, -5, 1));

    // Creates a shadow generator for the light
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.usePercentageCloserFiltering = true;

    // Load the container
    BABYLON.SceneLoader.ImportMesh("", "/static/", ContainerFile[container], scene, function (model) {
        model[0].position = new BABYLON.Vector3(-0.1, 0, 0);
        if (container == 2) {
            model[0].position = new BABYLON.Vector3(0, 0.5, 0);
        }
        model[0].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
        // Generate shadow
        shadowGenerator.addShadowCaster(model[0]);
    });

    if (container == 1) {
        if (NRow > 8) {
            NRow = 8
        }
        if (NCol > 12) {
            NCol = 12
        }
    }
    if (container == 2) {
        if (NRow > 4) {
            NRow = 4
        }
        if (NCol > 12) {
            NCol = 12
        }
    }
    if (container == 0) {
        if (NRow > 4) {
            NRow = 4
        }
        if (NCol > 5) {
            NCol = 5
        }
    }
    

    objx = 0, objy = 0, objz = 0
    if (container == 2 ) {
        objy = 16.5
    }
    if (container == 1) {
        objy = -15.5
    }

    for (let l = 0; l < moneyArray.length; l++) {
        BABYLON.SceneLoader.ImportMesh("", "/static/", moneyArray[l][0], scene, function (model) {
            for (k = 0; k < moneyArray[l][1]; k++) {
                for (i = 1; i < model.length; i++) {
                    model[i].setParent(null);
                    var mesh = model[i];
                    mesh.isVisible = false;
                    var NewObj = mesh.createInstance("NewObj" + i);
                    NewObj.position = new BABYLON.Vector3(0.17*(objx - (NRow-1)/2), 0.5+0.02*(objy), -0.08*(objz - (NCol-1)/2));
                    // Sets object to cast shadows
                    shadowGenerator.addShadowCaster(NewObj);
                }
                objx++;
                if (objx >= NRow) {
                    objx = 0;
                    if (objz >= NCol-1) {
                        objz = 0;
                        objy++;
                    }
                    else {
                        objz++;
                    }
                }
            }
            model[0].dispose(); // Delete original object
        });
    }


    // Creates environment box
    var envBox = scene.createDefaultEnvironment({
        // shadow opacity
        groundShadowLevel: 0.5,
    });
    envBox.setMainColor(new BABYLON.Color3.FromHexString('#b6fb84'));

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
