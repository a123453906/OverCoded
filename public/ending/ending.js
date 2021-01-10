// 遊戲狀態: success,failed,gaming
let gameState = 'success';
let Result;

let successBg;
let failedBg;
let nextButton;
let restartButton;

function preload() {

}

function setup() {
    createCanvas(1600, 800);

    successBg = loadImage('../assets/view/結算視窗/成功/success_bg.png');
    successBg.resize(1000, 500);
    failedBg = loadImage('../assets/view/結算視窗/失敗/failed_bg.png');
    failedBg.resize(1000, 500);
}

function draw() {
    if(gameState == 'success'){
        imageMode(CENTER);
        image(successBg, width / 2, height / 2, successBg.width / 2, successBg.height / 2);
        nextButton = createImg('../assets/view/結算視窗/成功/success_next.png');
        nextButton.size(250, 125);
        nextButton.mousePressed(nextGame);
        nextButton.position(1200, 600);
        restartButton = createImg('../assets/view/結算視窗/成功/success_restart.png');
        restartButton.size(250, 125);
        restartButton.mousePressed(restart);
        restartButton.position(270, 600);
    }
    if(gameState == 'failed'){
        imageMode(CENTER);
        image(failedBg, width / 2, height / 2, successBg.width / 2, successBg.height / 2);
        restartButton = createImg('../assets/view/結算視窗/成功/success_restart.png');
        restartButton.size(250, 125);
        restartButton.mousePressed(restart);
        restartButton.position(730, 600);
    }

}

function nextGame() {
    window.location.href='https://www.google.com/';
}

function restart() {
    window.location.reload()
}
