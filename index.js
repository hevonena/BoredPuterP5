let mic,recorder, soundFile;
let volTot;
let c;
let rT;

let song;

// P5JS preload
function preload() {
    song = loadSound('assets/sci.wav');
}
// user input
function mousePressed() {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}
// P5JS setup
function setup() {
    createCanvas(windowWidth, windowHeight, P2D);
    pixelDensity(1);

    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();

    // create a sound recorder
    recorder = new p5.SoundRecorder();

    // connect the mic to the recorder
    recorder.setInput(mic);

    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile();

    volTot = 0;
    c = 0;
    rT = random(100, 200);
}
// P5JS draw
function draw() {
    let vol = mic.getLevel();
    background(vol * 10 * 255);

    if (vol > 0 ) {
        volTot += - 0.1;
    } else {
        c++;
    }

    if (c > rT) {
        song.play();
        //soundFile.play();
        c = 0;
        rT = random(100, 2000);
    }
}

// P5JS windowResized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}