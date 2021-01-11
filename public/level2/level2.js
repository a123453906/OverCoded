//加入：
//1, 攻擊時會打巴掌（換腳）
//2, 到指定區域會變化
// 遊戲狀態: success,failed,gaming
let gameState = 'gaming';
let Result;

let successBg;
let failedBg;
let nextButton;
let restartButton;

//Load Image
let bottomlayer, cave, school, sign, tree, tree02, wood, code_frame,
    _delete, delete_press, putin, putin_press, submit, submit_press
let bg = [bottomlayer, cave, school, sign, tree, tree02, wood, code_frame]
let bg_button = [_delete, delete_press, putin, putin_press, submit, submit_press]

let role1;
let role1_active;

let role2;
let role2_active;

// let seg1;
// let seg2;

let ghost1;
let ghost1_state;

//新增車子
let car;
let car_active1;
let car_active2;
let car_accident_1;
let car_accident_2;

//三個按鈕
let button_del
let button_putin
let button_submit
// cave
let answer_cave;
// frame
let answer_frame;

//background sprite variable
let bg_sprite = []
let bg_tree_sprite = []

//加速部分parameter
let speed = 1
let speed_up_time = 5
//提示parameter
//提示持續時間
let hint_flash_time = 5
//提示閃爍間隔
let hint_interval = 0.5
let hint_type = 'light'
//目前獎勵寶箱之類型，(hint or speed)
let card_type = 'hint'
let isHint = false

//目前進行之關卡(0,1,2)
let level = 1

//使用者輸入之答案block number(按其輸入順序)(ex 1,2,3,...)
let code_result = []
//各個關卡之code segment數量
let code_block_num = [8, 9, 6]
//各個關卡具有提示之code segment number
let code_hint_num = [
    [1, 3, 6],
    [1, 2, 4, 6, 8],
    [1, 3, 5, 6]
]
// 設定正確答案，比對用
let code_answer = [
    [0, 2, 5],
    [0, 1, 3, 5, 7],
    [0, 1, 4, 5]
];
// 放答案位置xy的紀錄指針
let code_answer_x_now = 1360;
let code_answer_y_now = 200;

//保存各個code segment之sprite object
let code_segment = []

let code_question;

//角色判斷
let isOverlap1 = false;
let isOverlap2 = false;

let ghost_speed;

//鬼被攻擊
let ghost_faint = false;
let ghost_faint_time =5;

//人被攻擊
let role1_faint = false;
let role1_faint_time =1;

let role2_faint = false;
let role2_faint_time =1;

//sound new
let timeout = false;
let sounds = {}
let sDead = false;
let sFailed = false;
let sSuccess = false;
let sGift = false;
let sAttack = false;

let r = 0;
//ghost random move
let ghostRMX = 0;
let ghostRMY = 0;
setInterval(function () {
    const r = Math.floor(Math.random() * Math.floor(4));
    switch (r) {
        case 0:
            ghostRMX = 1;
            break;
        case 1:
            ghostRMX = -1;
            break;
        case 2:
            ghostRMY = 1;
            break;
        case 3:
            ghostRMY = -1;
            break;
    }
}, 1000)

//時間倒數(目前為200秒)
function countdown(iCount) {
    if (iCount > 0)
        setTimeout(function () { countdown(iCount - 0.5); }, 1000);
    document.getElementById("timeBar").style.width = iCount + '%';
    if (iCount > 50)
        document.getElementById("timeBar").className = 'progress-bar progress-bar-success';
    else if (iCount > 20)
        document.getElementById("timeBar").className = 'progress-bar progress-bar-warning';
    else if (iCount > 0)
        document.getElementById("timeBar").className = 'progress-bar progress-bar-danger';
    else {
        timeout = true;
        gameState = 'failed';
    }

}

function preload() {
    //sound new
    sounds.background = createAudio('../assets/sound/background.mp3');
    sounds.dead = createAudio('../assets/sound/dead.mp3');
    sounds.failed = createAudio('../assets/sound/failed.mp3');
    sounds.success = createAudio('../assets/sound/success.mp3');
    sounds.gift = createAudio('../assets/sound/gift.mp3');
    sounds.attack = createAudio('../assets/sound/attack.mp3');
    sounds.background.elt.loop = true;

    //將code_segment圖片讀入
    // 隨機生成在地圖四周
    for (let i = 0; i < code_block_num[level]; i++) {
        // let code_box = createSprite(200, 50 + 80 * i);
        let code_box = createSprite(Math.random() * 700 + 200, Math.random() * 580 + 120);
        // code_box.visible = false
        // code_box.immovable = true
        let img = loadImage('../assets/code_segment/level' + (level + 1) + '/code_0' + (i + 1) + '.png')
        code_box.addImage('box', img);
        code_box.setDefaultCollider()
        code_box.depth = 1
        // code_box.restitution = 0

        if (code_hint_num[level].includes(i + 1)) {
            loadImage('../assets/code_segment/level' + (level + 1) + '/code_0' + (i + 1) + '_hint.png', (image) => {
                code_box.addImage('box_hint', image)
            })
        }
        code_box.scale = 0.4
        code_segment.push(code_box)
    }
    // code_segment[0].visible = true
    code_question = loadImage('../assets/code_segment/level' + (level + 1) + '/題目_level'+(level+1)+'.png');

    bg.bottomlayer = loadImage('../assets/background/bg_bottomlayer.png');
    bg.school = loadImage('../assets/background/bg_item/bg_school.png');
    bg.sign = loadImage('../assets/background/bg_item/bg_sign.png');
    bg.cave = loadImage('../assets/background/bg_item/bg_cave.png');
    bg.tree = loadImage('../assets/background/bg_item/bg_tree.png');
    bg.tree02 = loadImage('../assets/background/bg_item/bg_tree02.png');
    // bg.wood = loadImage('../assets/background/bg_item/bg_wood.png');
    bg.code_frame = loadImage('../assets/background/bg_item/code_frame.png');

    bg_button._delete = loadImage('../assets/props/button/btn_delete.png');
    bg_button.delete_press = loadImage('../assets/props/button/btn_delete_press.png');
    bg_button.putin = loadImage('../assets/props/button/btn_putin.png');
    bg_button.putin_press = loadImage('../assets/props/button/btn_putin_press.png');
    bg_button.submit = loadImage('../assets/props/button/btn_submit.png');
    bg_button.submit_press = loadImage('../assets/props/button/btn_submit_press.png');
}

function setup() {
    let rand_type = Math.round(Math.random())
    card_type = (rand_type == 0)? 'speed' : 'hint'

    //new
    sounds.background.play();

    createCanvas(1600, 800);
    bg.bottomlayer.resize(1600,0)
    bg.school.resize(200,0)
    bg.sign.resize(100,0)
    bg.cave.resize(450,0)
    bg.tree.resize(100,0)
    bg.tree02.resize(100,0)
    // bg.wood.resize(100,0)
    bg.code_frame.resize(450,580)
    code_question.resize(475,0)

    // 建立角色1的動畫（role1）
    role1 = createSprite(280, 100);
    //碰撞偵測僅限角色腳的部分（大約）
    role1.setCollider("rectangle", 0, 60, 70,20)

    role1_active = loadAnimation('../assets/roles/playerG_front0001.png', '../assets/roles/playerG_front0003.png');
    role1.addAnimation('player1_front', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_back0001.png', '../assets/roles/playerG_back0003.png');
    role1.addAnimation('player1_back', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_left0001.png', '../assets/roles/playerG_left0002.png');
    role1.addAnimation('player1_left', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_right0001.png', '../assets/roles/playerG_right0002.png');
    role1.addAnimation('player1_right', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_left_push0001.png', '../assets/roles/playerG_left_push0002.png');
    role1.addAnimation('player1_left_push', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_right_push0001.png', '../assets/roles/playerG_right_push0002.png');
    role1.addAnimation('player1_right_push', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_ghost0001.png', '../assets/roles/playerG_ghost0002.png');
    role1.addAnimation('player1_dead', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_attack_left0001.png', '../assets/roles/playerG_attack_left0002.png');
    role1.addAnimation('player1_left_punch', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_attack_right0001.png', '../assets/roles/playerG_attack_right0002.png');
    role1.addAnimation('player1_right_punch', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_back_attack0001.png', '../assets/roles/playerG_back_attack0003.png');
    role1.addAnimation('player1_back_punch', role1_active);
    role1_active = loadAnimation('../assets/roles/playerG_front_attack0001.png', '../assets/roles/playerG_front_attack0003.png');
    role1.addAnimation('player1_front_punch', role1_active);

    // 建立角色2的動畫（role2）
    role2 = createSprite(700, 140);
    role2.setCollider("rectangle", 0, 60, 70,20)
    role2_active = loadAnimation('../assets/roles/playerR_front0001.png', '../assets/roles/playerR_front0003.png');
    role2.addAnimation('player2_front', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_back0001.png', '../assets/roles/playerR_back0003.png');
    role2.addAnimation('player2_back', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_left0001.png', '../assets/roles/playerR_left0002.png');
    role2.addAnimation('player2_left', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_right0001.png', '../assets/roles/playerR_right0002.png');
    role2.addAnimation('player2_right', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_left_push0001.png', '../assets/roles/playerR_left_push0002.png');
    role2.addAnimation('player2_left_push', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_right_push0001.png', '../assets/roles/playerR_right_push0002.png');
    role2.addAnimation('player2_right_push', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_ghost0001.png', '../assets/roles/playerR_ghost0002.png');
    role2.addAnimation('player2_dead', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_attack_left0001.png', '../assets/roles/playerR_attack_left0002.png');
    role2.addAnimation('player2_left_punch', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_attack_right0001.png', '../assets/roles/playerR_attack_right0002.png');
    role2.addAnimation('player2_right_punch', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_back_attack0001.png', '../assets/roles/playerR_back_attack0003.png');
    role2.addAnimation('player2_back_punch', role2_active);
    role2_active = loadAnimation('../assets/roles/playerR_front_attack0001.png', '../assets/roles/playerR_front_attack0003.png');
    role2.addAnimation('player2_front_punch', role2_active);

    // 設立需要搬動的程式碼方塊
    // seg1 = createSprite(400, 200);
    // seg1.addImage('seg1', loadImage('../assets/code_segment/level1/code_01.png'));
    // seg1.scale = 0.3;
    // seg2 = createSprite(400, 400);
    // seg2.addImage('seg2', loadImage('../assets/code_segment/level1/code_07.png'));
    // seg2.scale = 0.3;

    //設立車
    car =createSprite(0,230);
    car_active1 = loadAnimation('../assets/barrier/barrier_car_side1.png','../assets/barrier/barrier_car_side2.png');
    car.addAnimation('car_side_run',car_active1);
    car_active1 = loadAnimation('../assets/barrier/barrier_car_back2.png','../assets/barrier/barrier_car_back2_1.png');
    car.addAnimation('car_back_run',car_active1);
    car.setCollider("rectangle", 0, 0, 100,50)
    car.depth = 5;

    // 設立鬼
    ghost1 = createSprite(400, 600);
    ghost1.setCollider("rectangle", 0, 60, 70,20)
    ghost1_state = loadImage('../assets/barrier/barrier_ghost1.png')
    ghost1.addImage('ghost1', ghost1_state);
    ghost1_state = loadImage('../assets/barrier/barrier_ghost1_dead.png')
    ghost1.addImage('ghost1_dead', ghost1_state);
    // 鬼的初始速度->此部份可直接替換成韻淇的程式碼
    ghost1.setVelocity(3, 0);
    ghost1.depth = 5;

    // 設立禮物盒
    giftbox1 = createSprite(900, 430);
    // giftbox1 = createSprite(Math.random()*900 + 50, Math.random()*650 + 50);
    giftbox1.addImage('giftbox1', loadImage('../assets/props/gift_blue.png'));
    giftbox1.changeImage('giftbox1')
    giftbox1.setCollider("rectangle", 0, 0, 133,123)
    giftbox1.addImage('fastCard', loadImage('../assets/props/card_fast.png'));
    giftbox1.addImage('hintCard', loadImage('../assets/props/card_hint.png'));

    giftbox1.depth = -1;

    //3個按鈕（放入、刪除、繳交）
    button_putin = createSprite(1215, 745);
    button_putin.addImage('nonpress', bg_button.putin);
    button_putin.addImage('press', bg_button.putin_press);
    button_putin.scale = 0.3
    //置於最下層
    button_putin.depth = -1;

    button_del = createSprite(1365, 745);
    button_del.addImage('nonpress', bg_button._delete);
    button_del.addImage('press', bg_button.delete_press);
    button_del.scale = 0.3
    button_del.depth = -1

    button_submit = createSprite(1515, 745);
    button_submit.addImage('nonpress', bg_button.submit);
    button_submit.addImage('press', bg_button.submit_press);
    button_submit.scale = 0.3
    button_submit.depth = -1

    //背景個部件之sprite
    let sprite
    sprite = createSprite(1060, 430);
    sprite.addImage('default', bg.sign);
    sprite.setCollider("rectangle", 0, 40, 5,30)
    //使角色推不動
    sprite.mass = 999999999999
    bg_sprite.push(sprite)

    sprite = createSprite(100, 130);
    sprite.addImage('default', bg.school);
    sprite.setCollider("rectangle", 0, 75, 195,40)
    sprite.mass = 999999999999
    bg_sprite.push(sprite)

    // sprite = createSprite(900, 560);
    // sprite.addImage('default', bg.cave);
    // sprite.mass = 999999999999
    // sprite.depth = 0
    // let cave = sprite

    answer_cave = createSprite(900, 560);
    answer_cave.addImage('default', bg.cave);
    answer_cave.mass = 999999999999
    answer_cave.depth = -2
    let cave = answer_cave

    // sprite = createSprite(1360, 390);
    // sprite.addImage('default', bg.code_frame);
    // sprite.mass = 999999999999
    // bg_sprite.push(sprite)

    answer_frame = createSprite(1360, 390);
    answer_frame.addImage('default', bg.code_frame);
    answer_frame.mass = 999999999999
    //bg_sprite.push(sprite)

    //放置樹木
    let tree_pos = [[520,-20],[600,0],[570,85],[610,330],[100,400],[170,440],[930,95],
        [890,132],[830,135]]
    for (let i = 0; i < tree_pos.length; i++) {
        const element = tree_pos[i];
        let sprite = createSprite(element[0], element[1]);
        sprite.addImage('default', bg.tree);
        sprite.setCollider("rectangle", 0, 50, 50,35)
        sprite.mass = 999999999999
        bg_tree_sprite.push(sprite)
    }
    // bg_sprite.push(bg_tree_sprite)
    let tree2_pos = [[670,300],[950,115]]
    for (let i = 0; i < tree2_pos.length; i++) {
        const element = tree2_pos[i];
        let sprite = createSprite(element[0], element[1]);
        sprite.addImage('default', bg.tree02);
        sprite.setCollider("rectangle", 0, 50, 50,35)
        sprite.mass = 999999999999
        bg_tree_sprite.push(sprite)
    }
    bg_sprite.push(bg_tree_sprite)

    //將所有背景相關物件設為按鈕之上、角色之下
    for (let i = 0; i < bg_sprite.flat().length; i++) {
        const element = bg_sprite.flat()[i];
        element.depth = 1
    }
    // Frame設定：按鈕之上、角色之下
    answer_frame.depth = 1
    //使一塊一塊code不會重疊
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];

        let overlap_code = false
        let overlap_bg = false
        do {
            //code與code之間
            for (let j = 0; j < code_segment.length; j++) {
                const element2 = code_segment[j];
                if(element.overlap(element2)){
                    overlap_code = true
                    break
                }else{
                    overlap_code = false
                }
            }
            //bg物件與code之間
            for (let j = 0; j < bg_sprite.flat().length; j++) {
                const element2 = bg_sprite.flat()[j];
                if(element.overlap(element2)){
                    overlap_bg = true
                    break
                }else{
                    overlap_bg = false
                }
            }
            //角色和放置區域與禮物盒偵測
            if(element.overlap(giftbox1)) overlap_bg = true
            if(element.overlap(cave)) overlap_bg = true
            if(element.overlap(role1)) overlap_bg = true
            if(element.overlap(role2)) overlap_bg = true

            if (overlap_code || overlap_bg) {
                element.position.x = Math.random() * 700 + 200
                element.position.y = Math.random() * 580 + 120
            }
        } while (overlap_code || overlap_bg);
    }
    // 結算時圖片匯入
    successBg = loadImage('../assets/view/結算視窗/成功/success_bg.png');
    successBg.resize(1000, 500);
    failedBg = loadImage('../assets/view/結算視窗/失敗/failed_bg.png');
    failedBg.resize(1000, 500);
}

function draw() {
    background('white');

    //new
    sAttack = false;
    sGift = false;
    sSuccess = false;
    sFailed = false;
    sDead = false;

    if(timeout==true)
        sFailed = true;

    //角色放置深度(2與4層)
    role1.depth = 2
    role2.depth = 4

    if (role2.position.y < role1.position.y) {
        role1.depth = 4
        role2.depth = 2
    }

    let depth2_role = (role1.depth == 2)?role1:role2
    let depth4_role = (role1.depth == 4)?role1:role2

    //背景與角色前後之覆蓋處理(bg|role|bg|role|bg，對應1|2|3|4|5層次)
    for (let i = 0; i < bg_sprite.flat().length; i++) {
        const element = bg_sprite.flat()[i];
        if (element.position.y < depth2_role.position.y) {
            element.depth = 1
        }else if (element.position.y < depth4_role.position.y && element.position.y >= depth2_role.position.y) {
            element.depth = 3
        }else if (element.position.y >= depth4_role.position.y) {
            element.depth = 5
        }
    }


    isOverlap1 = false;
    isOverlap2 = false;
    if ((role1.overlap(giftbox1) || role2.overlap(giftbox1)) && giftbox1.visible) {
        //new
        sGift = true;
        //new
        if (card_type == 'hint') {
            giftbox1.changeImage('hintCard');
            isHint = true

        } else if (card_type == 'speed' && speed == 1) {
            giftbox1.changeImage('fastCard');
            speed = 2
            speed_up_time = 5
        }
    }
    //加速
    if (speed > 1 && speed_up_time * getFrameRate() > 0) {
        speed_up_time -= 1 / getFrameRate()
        //2秒後卡片會消失
        if (speed_up_time < 3) {
            giftbox1.visible = false
            // isHint = false
        }
        //speed_up_time到時會回復原本速度
    } else {
        speed_up_time = 5
        speed = 1
    }
    //要閃爍之code segment block number
    let hint_num = code_hint_num[level][0]
    //計算應該要提示的block number，看使用者對幾個block決定要提示的number
    for (let i = 0; i < code_result.length; i++) {
        //計算下個應提示之block number
        if (code_result[i] + 1 == code_hint_num[level][i]) {
            //如正確，應提示號碼更改為下一個答案
            if (i + 1 < code_hint_num[level].length) {
                hint_num = code_hint_num[level][i + 1]
            }
            continue
        }
        break
    }

    // // 角色1搬運方塊、行走動畫及鍵盤設定
    // for (let k = 0; k < code_segment.length; k++)
    //     role1.displace(code_segment[k]);
    // if (keyIsDown(LEFT_ARROW)) {   // left
    //     for (let k = 0; k < code_segment.length; k++) {
    //         if (role1.overlap(code_segment[k])) {
    //             isOverlap1 = true;
    //             break;
    //         }
    //     }
    //     if (isOverlap1==true) {
    //         role1.changeImage('player1_left_push');
    //         role1.setVelocity(-5 * speed, 0);
    //         // isOverlap1 = false;
    //     } else {
    //         if (keyIsDown(191)) {
    //             role1.changeImage('player1_left_punch');
    //         } else {
    //             role1.changeImage('player1_left');
    //             role1.setVelocity(-5 * speed, 0);
    //         }
    //     }
    // } else if (keyIsDown(RIGHT_ARROW)) {
    //     for (let k = 0; k < code_segment.length; k++) {
    //         if (role1.overlap(code_segment[k])) {
    //             isOverlap1 = true;
    //             break;
    //         }
    //     }
    //     if (isOverlap1==true) {
    //         role1.changeImage('player1_right_push');
    //         role1.setVelocity(5 * speed, 0);
    //         // isOverlap1 = false;
    //     } else {
    //         if (keyIsDown(191)) {
    //             role1.changeImage('player1_right_punch');
    //         } else {
    //             role1.changeImage('player1_right');
    //             role1.setVelocity(5 * speed, 0);
    //         }

    //     }
    // } else if (keyIsDown(UP_ARROW)) {
    //     if (keyIsDown(191)) {
    //         role1.changeImage('player1_back_punch');
    //     } else {
    //         role1.changeImage('player1_back');
    //         role1.setVelocity(0, -5 * speed);
    //     }
    // } else if (keyIsDown(DOWN_ARROW)) {
    //     if (keyIsDown(191)) {
    //         role1.changeImage('player1_front_punch');
    //     } else {
    //         role1.changeImage('player1_front');
    //         role1.setVelocity(0, 5 * speed);
    //     }
    // } else {            // no key press -> stand still
    //     if (keyIsDown(191)) {
    //         role1.changeImage('player1_front_punch');
    //     } else {
    //         role1.changeImage('player1_front');
    //         role1.setVelocity(0, 0);
    //     }
    // }

    // 0110 修改起頭
    // 將放入、刪除、對答案移出來自成一個function
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];
        element.collide(answer_frame);

        // 控制三個按鈕的動作
        // 角色1使用shift操作
        // 三個動作
        // 按鈕：放入->按一下shift會自動將方塊放入對答案的區域當中
        if((role1.overlap(button_putin)) && (keyIsDown(16)) || (role2.overlap(button_putin)) && (keyIsDown(69))){
            button_putin.changeImage('press');
            if(element.overlap(answer_cave)){
                // 0108 角色 新增加的部分:如果按下放入，segment的狀態會變成穿透任何物體
                element.immovable = true;
                // 修改的ending
                element.position.x = code_answer_x_now;
                element.position.y = code_answer_y_now;
                code_answer_y_now += 100;
                code_result.push(i);
                console.log(answer_frame.width);
                console.log(answer_frame.height);
            }
        }else{
            button_putin.changeImage('nonpress');
        }
        // 按鈕：刪除->按一下shift會自動將最後一塊放入的方塊移除，移除的方塊隨機散落，並更新Stack的存取位置
        if((role1.overlap(button_del)) && (keyIsDown(16)) || (role2.overlap(button_del)) && (keyIsDown(69))){
            button_del.changeImage('press');
            if(code_result.length > 0){
                let trash = code_result.pop();
                // 0108 角色1 新增刪除避免方塊回到柵欄，且重新maintain segment位置時，code_segment會變回無法穿透任何物體（immovable=false）
                // 刪除後新的segment隨機位置有調整，從這邊到「code_segment[trash].immovable = false;」錄製貼上即可
                code_segment[trash].immovable = true;
                code_segment[trash].position.x = 700 - Math.random() * 650 + 50 ;
                code_segment[trash].position.y = 800 - Math.random() * 100;
                console.log(code_segment[trash].position.x)
                console.log(code_segment[trash].position.y)
                code_segment[trash].immovable = false;
                // 修改的ending

                // code_segment[trash].position.x = Math.random() * 900 + 100;
                // code_segment[trash].position.y = Math.random() * 650 + 50;
                console.log(code_segment[trash].position.x)
                console.log(code_segment[trash].position.y)

                code_answer_y_now -= 100;
                console.log(code_answer_y_now);
                //role1.position.x = 400;
                // role1.position.x -= 100;
                if(role1.overlap(button_del)){
                    role1.position.x -= 100;
                }
                if(role2.overlap(button_del)){
                    role2.position.x -= 100;
                }
            }
        }else{
            button_del.changeImage('nonpress');
        }

        // 按鈕：對答案->按一下shift會自動對答案（使用陣列比對）
        if((role1.overlap(button_submit)) && (keyIsDown(16)) || (role2.overlap(button_submit)) && (keyIsDown(69))){
            button_submit.changeImage('press');
            console.log(code_result);
            console.log(code_answer[level]);
            console.log(code_result.length == code_answer[level].length);

            if(code_result.length == code_answer[level].length){
                if(check_array(code_result,code_answer[level])){
                    //new
                    sSuccess = true;
                    //new
                    console.log('Correct');
                    gameState = 'success';
                }else{
                    //new
                    sFailed = true;
                    //new
                    console.log('Wrong');
                    gameState = 'failed';
                }
            }else{
                //new
                sFailed = true;
                //new
                console.log('Wrong');
                gameState = 'failed';
            }

        }else{
            button_submit.changeImage('nonpress');
        }
    }

    // 角色1搬運方塊、行走動畫及鍵盤設定
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];

        if (keyIsDown(LEFT_ARROW)) { // left
            if (role1.overlap(element) || isOverlap1 == true) {
                isOverlap1 = true;
                role1.changeImage('player1_left_push');
                role1.setVelocity(-5 * speed, 0);
                role1.displace(element);
                break;
            } else {
                if (keyIsDown(191)) {
                    role1.changeImage('player1_left_punch');
                } else {
                    role1.changeImage('player1_left');
                    role1.setVelocity(-5 * speed, 0);
                }
            }
        } else if (keyIsDown(RIGHT_ARROW)) {
            if (role1.overlap(element) || isOverlap1 == true) {
                isOverlap1 = true;
                role1.changeImage('player1_right_push');
                role1.setVelocity(5 * speed, 0);
                role1.displace(element);
                break;
            } else {
                if (keyIsDown(191)) {
                    role1.changeImage('player1_right_punch');
                } else {
                    role1.changeImage('player1_right');
                    role1.setVelocity(5 * speed, 0);
                }
            }
        } else if (keyIsDown(UP_ARROW)) {
            if (keyIsDown(191)) {
                role1.changeImage('player1_back_punch');
                break;
            } else {
                role1.changeImage('player1_back');
                role1.setVelocity(0, -5 * speed);
            }
        } else if (keyIsDown(DOWN_ARROW)) {
            if (keyIsDown(191)) {
                role1.changeImage('player1_front_punch');
            } else {
                role1.changeImage('player1_front');
                role1.setVelocity(0, 5 * speed);
            }
        } else { // no key press -> stand still
            if (keyIsDown(191)) {
                role1.changeImage('player1_front_punch');
            } else {
                role1.changeImage('player1_front');
                role1.setVelocity(0, 0);
            }
        }
        role1.displace(element);

        //此code block應提示
        if (i == hint_num - 1) {
            //根據preload時決定的Image Label而選定 'box' 'box_hint'的名字
            hint_perform(element, 'box', 'box_hint')
        }
    }

    // 角色2搬運方塊、行走動畫及鍵盤設定
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];

        if (keyIsDown(65)) { // left
            if (role2.overlap(element) || isOverlap2 == true) {
                isOverlap2 = true;
                role2.changeImage('player2_left_push');
                role2.setVelocity(-5 * speed, 0);
                role2.displace(element);
                break;
            } else {
                if (keyIsDown(81)) {
                    role2.changeImage('player2_left_punch');
                } else {
                    role2.changeImage('player2_left');
                    role2.setVelocity(-5 * speed, 0);
                }
            }
        } else if (keyIsDown(68)) {
            if (role2.overlap(element) || isOverlap2 == true) {
                isOverlap2 = true;
                role2.changeImage('player2_right_push');
                role2.setVelocity(5 * speed, 0);
                role2.displace(element);
                break;
            } else {
                if (keyIsDown(81)) {
                    role2.changeImage('player2_right_punch');
                } else {
                    role2.changeImage('player2_right');
                    role2.setVelocity(5 * speed, 0);
                }
            }
        } else if (keyIsDown(87)) {
            if (keyIsDown(81)) {
                role2.changeImage('player2_back_punch');
                break;
            } else {
                role2.changeImage('player2_back');
                role2.setVelocity(0, -5 * speed);
            }
        } else if (keyIsDown(83)) {
            if (keyIsDown(81)) {
                role2.changeImage('player2_front_punch');
            } else {
                role2.changeImage('player2_front');
                role2.setVelocity(0, 5 * speed);
            }
        } else { // no key press -> stand still
            if (keyIsDown(81)) {
                role2.changeImage('player2_front_punch');
            } else {
                role2.changeImage('player2_front');
                role2.setVelocity(0, 0);
            }
        }
        role2.displace(element);

        //此code block應提示
        if (i == hint_num - 1) {
            //根據preload時決定的Image Label而選定 'box' 'box_hint'的名字
            hint_perform(element, 'box', 'box_hint')
        }
    }

    // 0110 修改ending
    // // // 角色2搬運方塊、行走動畫及鍵盤設定
    // for (let k = 0; k < code_segment.length; k++)
    //     role2.displace(code_segment[k]);
    // if (keyIsDown(65)) {   // left
    //     for (let k = 0; k < code_segment.length; k++) {
    //         if (role1.overlap(code_segment[k])) {
    //             isOverlap2 = true;
    //             break;
    //         }
    //     }
    //     if (isOverlap2==true) {
    //         role2.changeImage('player2_left_push');
    //         role2.setVelocity(-5 * speed, 0);
    //         // isOverlap2 = false;
    //     } else {
    //         role2.changeImage('player2_left');
    //         role2.setVelocity(-5 * speed, 0);
    //     }
    // } else if (keyIsDown(68)) {
    //     for (let k = 0; k < code_segment.length; k++) {
    //         if (role1.overlap(code_segment[k])) {
    //             isOverlap2= true;
    //             break;
    //         }
    //     }
    //     if (isOverlap2==true) {
    //         role2.changeImage('player2_right_push');
    //         role2.setVelocity(5 * speed, 0);
    //         // isOverlap2 = false;
    //     } else {
    //         role2.changeImage('player2_right');
    //         role2.setVelocity(5 * speed, 0);
    //     }
    // } else if (keyIsDown(87)) {
    //     role2.changeImage('player2_back');
    //     role2.setVelocity(0, -5 * speed);
    // } else if (keyIsDown(83)) {
    //     role2.changeImage('player2_front');
    //     role2.setVelocity(0, 5 * speed);
    // } else {            // no key press -> stand still
    //     role2.changeImage('player2_front');
    //     role2.setVelocity(0, 0);
    // }

    // 1228新增功能:兩個角色不能互相穿越
    role1.collide(role2);
    //role1.collide(ghost1);
    //role2.collide(ghost1);

    //1228新增功能: 兩個人一起推，才有辦法推動大型的方塊
    // if ((role1.overlap(seg2)) && (role2.overlap(seg2))) {
    //     role1.displace(seg2);
    //     role2.displace(seg2);
    // } else {
    //     role1.collide(seg2);
    //     role2.collide(seg2);
    // }

    // //1228新增功能:打鬼
    // // 鬼的移動路徑->此部份可直接替換成韻淇的程式碼
    // if ((ghost1.position.x > width) || (ghost1.position.y > height)) {
    //     ghost1.setVelocity(-3, 0);
    // }
    // if ((ghost1.position.x < 0) || (ghost1.position.y < 0)) {
    //     ghost1.setVelocity(3, 0);
    // }

    //車與人的互動
    if(role1.overlap(car)){
        car_accident_1 =true;
    }else{
        car_accident_1 =false;
    }

    if(role2.overlap(car)){
        car_accident_2 =true;
    }else{
        car_accident_2 =false;
    }
    if(car_accident_1){
        role1.changeImage('player1_dead');
        role1.setVelocity(0, 0);
    }
    if(car_accident_2){
        role2.changeImage('player2_dead');
        role2.setVelocity(0, 0);
    }

    // 設定鬼與角色1 的互動
    if (keyIsDown(191)) {
        // 3, 玩家按下攻擊鍵，鬼死掉
        ghost1.setDefaultCollider();
        if (role1.overlap(ghost1) && !role1_faint) {
            ghost_faint = true;
        }

    } else {
        // 4, 如果鬼沒昏且沒按，玩家死亡
        ghost1.setCollider("rectangle", 0, 60, 70,20)
        if (role1.overlap(ghost1)) {
            if(!ghost_faint){
                role1_faint = true
                ghost1.changeImage('ghost1');
            }
        }
    }
    //設定當角色1死亡後，五秒後回到原點
    if(role1_faint) {
        //new
        sDead = true;
        //new
        //人昏倒
        role1.changeImage('player1_dead');
        if (role1_faint_time > 0) {
            //倒數昏倒時間
            role1_faint_time -= 1 / getFrameRate();
            role1.setVelocity(0, 0);

        } else {
            //時間到恢復正常
            role1.position.x = 300;
            role1.position.y = 100;
            role1_faint = false;
            role1_faint_time = 1;
            role1.changeImage('player1');
        }
    }
    // 設定鬼與角色2 的互動
    if (keyIsDown(81)) {
        // 3, 玩家按下攻擊鍵，鬼死掉
        ghost1.setDefaultCollider();
        if (role2.overlap(ghost1) && !role2_faint) {
            ghost_faint = true;
        }

    } else {
        // 4, 如果鬼沒昏且沒按，玩家死亡
        ghost1.setCollider("rectangle", 0, 60, 70,20)
        if (role2.overlap(ghost1)) {
            if(!ghost_faint){
                role2_faint = true
                ghost1.changeImage('ghost1');
            }
        }
    }
    //設定當角色2死亡後，五秒後回到原點
    if(role2_faint) {
        //new
        sDead = true;
        //new
        //人昏倒
        role2.changeImage('player2_dead');
        if (role2_faint_time > 0) {
            //倒數昏倒時間
            role2_faint_time -= 1 / getFrameRate();
            role2.setVelocity(0, 0);

        } else {
            //時間到恢復正常
            role2.position.x = 500;
            role2.position.y = 100;
            role2_faint = false;
            role2_faint_time = 1;
            role2.changeImage('player2');
        }
    }

    if(car.position.x > 700){
        car.changeImage('car_back_run');
        car.setVelocity(0,-1);
        car.scale=0.8;
    }else{
        car.changeImage('car_side_run');
        car.setVelocity(1,0);
        car.scale=0.95;
    }
    if(car.position.y < 0){
        car.position.x = 0;
        car.position.y = 240;
    }

    //鬼偵測玩家距離
    let distanceP1X = Math.abs(ghost1.position.x - role1.position.x);
    let distanceP1Y = Math.abs(ghost1.position.y - role1.position.y);
    let distance1 = Math.sqrt(Math.pow(distanceP1X, 2) + Math.pow(distanceP1Y, 2));

    let distanceP2X = Math.abs(ghost1.position.x - role2.position.x);
    let distanceP2Y = Math.abs(ghost1.position.y - role2.position.y);
    let distance2 = Math.sqrt(Math.pow(distanceP2X, 2) + Math.pow(distanceP2Y, 2));

    if (distance1 < 300 && distance1 > 150 && (distance1 < distance2)&&!ghost_faint) {
        ghost1.changeImage('ghost1');
        // ghost chase player 1
        ghost_speed = 0.01;
        ghost1.position.x += (role1.position.x - ghost1.position.x) * ghost_speed;
        ghost1.position.y += (role1.position.y - ghost1.position.y) * ghost_speed;
    } else if (distance2 < 300 && distance2 > 150 && (distance2 < distance1)&&!ghost_faint) {
        ghost1.changeImage('ghost1');
        // ghost chase player 2
        ghost_speed = 0.01;
        ghost1.position.x += (role2.position.x - ghost1.position.x) * ghost_speed;
        ghost1.position.y += (role2.position.y - ghost1.position.y) * ghost_speed;

    } else if (distance1 <= 150 && (distance1 < distance2)&&!ghost_faint) {
        ghost1.changeImage('ghost1');
        // ghost chase player 1 faster
        ghost_speed = 0.02;
        ghost1.position.x += (role1.position.x - ghost1.position.x) * ghost_speed;
        ghost1.position.y += (role1.position.y - ghost1.position.y) * ghost_speed;
    } else if (distance2 <= 150 && (distance2 < distance1)&&!ghost_faint) {
        ghost1.changeImage('ghost1');
        // ghost chase player 2 faster
        ghost_speed = 0.02;
        ghost1.position.x += (role2.position.x - ghost1.position.x) * ghost_speed;
        ghost1.position.y += (role2.position.y - ghost1.position.y) * ghost_speed;
    } else {
        if(ghost_faint){
            //new
            sAttack = true;
            //new
            //鬼昏倒
            ghost1.changeImage('ghost1_dead');
            if(ghost_faint_time > 0){
                //倒數昏倒時間
                ghost_faint_time -= 1 / getFrameRate();
                ghost1.setVelocity(0, 0);

            }else{
                //時間到恢復正常
                ghost_faint = false;
                ghost_faint_time =5;
            }
        }else{
            // ghost random move
            ghost1.changeImage('ghost1');
            if(ghost1.position.x > width){
                ghostRMX = -1;
            }else if(ghost1.position.x < 0){
                ghostRMX = 1;
            }
            if(ghost1.position.y > height){
                ghostRMY = -1;
            }else if(ghost1.position.y < 0) {
                ghostRMY = 1;
            }
            if(ghost1.position.x < 200 && ghost1.position.y < 100){
                ghostRMX = -1;
                ghostRMY = -1;
            }
            ghost1.setVelocity(ghostRMX,ghostRMY);
        }

    }

    // console.log(role1.position.y-role1.previousPosition.y)

    //角色與背景物件之碰撞處理
    for (let i = 0; i < bg_sprite.flat().length; i++) {
        const element = bg_sprite.flat()[i];
        // role1.bounce(element)
        // element.restitution = -1
        if(role1.overlap(element)){
            if(role1.previousPosition != undefined){
                objCollideDeal(role1,element)
                // r1_Overlap = true
            }
        }
        if(role2.overlap(element)){
            if(role2.previousPosition != undefined){
                objCollideDeal(role2,element)
                // r2_Overlap = trues
            }
        }
    }
    // 角色與frame碰撞處理
    if(role1.overlap(answer_frame)){
        if(role1.previousPosition != undefined){
            objCollideDeal(role1,answer_frame)
            // r1_Overlap = true
        }
    }
    if(role2.overlap(answer_frame)){
        if(role2.previousPosition != undefined){
            objCollideDeal(role2,answer_frame)
            // r2_Overlap = trues
        }
    }


    //code block與code block 及 code block與背景物件之碰撞處理
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];
        for (let j = 0; j < code_segment.length; j++) {
            const element2 = code_segment[j];
            if(element.overlap(element2) && (element.previousPosition.x != element.position.x || element.previousPosition.y != element.position.y)) {
                objCollideDeal(element,element2)
                if(role1.overlap(element)) objCollideDeal(role1,element)
                if(role2.overlap(element)) objCollideDeal(role2,element)


                // console.log("dd")
                break
            }
        }
        for (let j = 0; j < bg_sprite.flat().length; j++) {
            const element2 = bg_sprite.flat()[j];
            if (element.position.y < (element2.position.y+element2.height/3)) {
                element.depth = 0
            }else{
                if (element.position.y < depth2_role.position.y+depth4_role.height/3) {
                    element.depth = 1
                } else if (element.position.y < depth4_role.position.y+depth4_role.height/3){
                    element.depth = 3
                } else {
                    element.depth = 5
                }

            }

            if(element.overlap(element2) && (element.previousPosition.x != element.position.x || element.previousPosition.y != element.position.y)) {
                objCollideDeal(element,element2)
                if(role1.overlap(element)) objCollideDeal(role1,element)
                if(role2.overlap(element)) objCollideDeal(role2,element)
            }


        }
    }

    image(bg.bottomlayer,0,0)
    image(code_question,1125,0)
    // console.log(role1.previousPosition)
    // image(bg.code_frame,1140,0)
    // 0108新增：偵測role碰到邊界，彈回canvas中
    if((role1.position.x - 20) <= 0 && keyIsDown(LEFT_ARROW)){
        role1.position.x += 20;
    }
    if((role1.position.y - 10) <= 0 && keyIsDown(UP_ARROW)){
        role1.position.y += 20;
    }
    if((role1.position.x + 20) >= width && keyIsDown(RIGHT_ARROW)){
        role1.position.x -= 20;
    }
    if((role1.position.y + 20) >= height && keyIsDown(DOWN_ARROW)){
        role1.position.y -= 20;
    }

    if(role2.position.x <= 0 && keyIsDown(65)){
        role2.position.x += 20;
    }
    if(role2.position.y <= 0 && keyIsDown(87)){
        role2.position.y += 20;
    }
    if(role2.position.x >= width && keyIsDown(68)){
        role2.position.x -= 20;
    }
    if(role2.position.y >= height && keyIsDown(83)){
        role2.position.y -= 20;
    }
    // 修改的ending
    //0108新增：segment邊界超出範圍會無法前進，彈回canvas中
    for (let i = 0; i < code_segment.length; i++) {
        const element = code_segment[i];
        if ((element.position.x - 50) <= 0) {
            element.position.x += 100;
        }
        if ((element.position.y - 30) <= 0) {
            element.position.y += 70;
        }
        if ((element.position.x + 50) >= width) {
            element.position.x -= 100;
        }
        if ((element.position.y + 30) >= height) {
            element.position.y -= 30;
        }
    }
    // 修改的ending

    drawSprites();
    // 結算畫面(0108修改：縮小結算換面的大小)
    if(gameState == 'success'){
        imageMode(CENTER);
        image(successBg, width / 2, height / 2, successBg.width / 3, successBg.height / 3);
        nextButton = createImg('../assets/view/結算視窗/成功/success_next.png');
        nextButton.size(250, 125);
        nextButton.mousePressed(nextGame);
        nextButton.position(950, 525);
        restartButton = createImg('../assets/view/結算視窗/成功/success_restart.png');
        restartButton.size(250, 125);
        restartButton.mousePressed(restart);
        restartButton.position(520, 525);
    }
    if(gameState == 'failed'){
        imageMode(CENTER);
        image(failedBg, width / 2, height / 2, successBg.width / 3, successBg.height / 3);
        restartButton = createImg('../assets/view/結算視窗/成功/success_restart.png');
        restartButton.size(250, 125);
        restartButton.mousePressed(restart);
        restartButton.position(730, 525);
    }
    // 修改的ending

    //new
    if (sDead == true && sounds.dead.elt.currentTime == 0) {
        sounds.dead.play();
    } else if (sDead == false) {
        sounds.dead.elt.currentTime = 0;
    }
    if (sFailed == true && sounds.failed.elt.currentTime == 0) {
        sounds.background.stop();
        sounds.failed.play();
    }
    if (sSuccess == true && sounds.success.elt.currentTime == 0) {
        sounds.background.stop();
        sounds.success.play();
    }
    if (sGift == true && sounds.gift.elt.currentTime == 0) {
        sounds.gift.play();
    }
    if (sAttack == true && sounds.attack.elt.currentTime == 0) {
        sounds.attack.play();
    } else if (sAttack == false) {
        sounds.attack.elt.currentTime = 0;
    }
    //new


}

//將code_box以hint_interval秒之間隔閃爍hint_flash_time秒
function hint_perform(code_box, ori_code_block_name, light_code_block_name) {
    if (isHint && hint_flash_time * getFrameRate() > 0) {
        hint_flash_time -= 1 / getFrameRate()
        hint_interval -= 1 / getFrameRate()
        if (hint_interval < 0) {
            if (hint_type == 'light') {
                code_box.changeImage(ori_code_block_name)
                hint_type = ''
            } else {
                hint_type = 'light'
                code_box.changeImage(light_code_block_name)
            }

            hint_interval = 0.5
        }
        if (hint_flash_time < 3) {
            giftbox1.visible = false
            // isHint = false
            // box.changeImage('box')
        }
    } else {
        hint_flash_time = 5
        code_box.changeImage(ori_code_block_name)
        isHint = false
    }
}

//role碰撞到obj時之碰撞處理
function objCollideDeal(role,obj) {
    //角色往右時碰撞到物件，將其往反方向推
    if(role.position.x > role.previousPosition.x)
        role.position.x -= role.position.x-(role.previousPosition.x-6.0* speed)
    //左
    else if(role.position.x < role.previousPosition.x)
        role.position.x += (role.previousPosition.x)-role.position.x+6.0* speed
    //下
    else if(role.position.y > role.previousPosition.y){
        role.position.y -= (role.position.y)-(role.previousPosition.y-6.0* speed)
        //code block卡在角落出不來時，一直擠旁邊可以把方塊擠出來
        if(role.position.x > obj.position.x && code_segment.includes(obj)) obj.position.x -= 1
        else if(role.position.x < obj.position.x && code_segment.includes(obj)) obj.position.x += 1
    }
    //上
    else if(role.position.y < role.previousPosition.y){
        role.position.y += (role.previousPosition.y)-(role.position.y-6.0* speed)
        if(role.position.x > obj.position.x && code_segment.includes(obj)) obj.position.x -= 1
        else if(role.position.x < obj.position.x && code_segment.includes(obj)) obj.position.x += 1
    }
}

// 對答案時使用：兩個Array比較是否相同
function check_array(array1, array2){
    let count = 0;
    for (let i = 0; i < array1.length; i++){
        if(array1[i] == array2[i]){
            count += 1;
        }
    }
    if(count == array1.length){
        return true;
    }else{
        return false;
    }
}

function nextGame() {
    window.location.href='../level3/';
}

function restart() {
    window.location.reload()
}
