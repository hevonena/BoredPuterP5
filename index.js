// Declare variables
let mic, recorder
let soundFiles = [];
let temperature = 1000;
let threshold1 = 0.01;
let threshold2 = 0.001;
let talkingTime = 0;
let extraTime = 400;
let recordingIndex = 0;
let hasRecording = false;
let isRecording = false;
let lastPlayedTime = 0;
let isFullScreen = false;
let r, g, b;
let pvol = 0;
let volCountdown = 0;
let delay;

// Handle user input for toggling full screen mode
function mousePressed() {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}

function setup() {
    // Set up canvas
    createCanvas(windowWidth, windowHeight);

    // Initialize microphone input
    mic = new p5.AudioIn();
    mic.start();

    // Initialize delay effect
    delay = new p5.Delay();

    // Initialize sound recorder
    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);

    // Create an empty sound file list that we will use to store the recordings
    for ( let i = 0; i < 1000; i++) {
        soundFiles[i] = new p5.SoundFile();

        // Set random color values for each sound file
        r = random(255);
        g = random(255);
        b = random(255);
    }
}

function draw() {
    // Get the volume level
    let vol = mic.getLevel();

    // Smooth the volume over time
    let volSmooth = 60 * smoothy(vol, pvol, 0.9999);
    pvol = mic.getLevel();

    // Set background color based on volume
    if (vol < threshold1) {
        vol -= threshold1 / 10;
    }
    if (volCountdown > 0) {
        volCountdown -= 1;
    }
    background(constrain(volSmooth * r + volCountdown, 0, 255), 
               constrain(volSmooth * g + volCountdown, 0, 255), 
               constrain(volSmooth * b + volCountdown, 0, 255));

    // Check if user is "talking"
    let currentTime = millis();
    let timeSinceLastPlayed = currentTime - lastPlayedTime;
    let isTalking = timeSinceLastPlayed < talkingTime;
    extraTime -= 10;

    // Check if volume is above threshold to start recording
    if (vol > threshold1 && !isRecording && !isTalking) {
        recorder.record(soundFiles[recordingIndex]);
        isRecording = true;
        extraTime = random(temperature, 2 * temperature);
        recordingIndex++;
        volCountdown = random(10, 200);
    }

    // Check if volume is below threshold to stop recording
    if (vol < threshold2 && isRecording) {
        recorder.stop();
        extraTime = random(temperature, 2 * temperature);
        talkingTime = soundFiles[recordingIndex - 1].duration() * 1000;
        isRecording = false;
        hasRecording = true;
    }

    // If user is not talking and there is a recording, play a sound file
    if (!isTalking && hasRecording && extraTime < 0) {
        let soundIndex = floor(random(recordingIndex));
        let sound = soundFiles[soundIndex];

        if(random(1) < 0.5) {
        // Apply delay effect to
    delay.process(sound, random(0.1, 0.5), 0.5, 1000);
    delay.setType('pingPong'); // a stereo effect
        }
    sound.play();
    lastPlayedTime = currentTime + random(200, 250);
    extraTime = random(temperature, 2*temperature);
    //print("Playing sound..."+soundIndex+" "+sound.duration()+"s");
    
  }
}

// P5JS windowResized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function smoothy(value, previousValue, alpha) {
    return alpha * value + (1 - alpha) * previousValue;
}
