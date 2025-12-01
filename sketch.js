// 走路動畫的圖片精靈
let walkSpriteSheet;
const walkFrames = 7;
const walkSpriteWidth = 675;
const walkSpriteHeight = 102;
let walkFrameWidth;

// 跳躍動畫的圖片精靈
let jumpSpriteSheet;
const jumpFrames = 3;
const jumpSpriteWidth = 274;
const jumpSpriteHeight = 84;
let jumpFrameWidth;

// 頭頂動畫的圖片精靈
let headbuttSpriteSheet;
const headbuttFrames = 10;
const headbuttSpriteWidth = 965;
const headbuttSpriteHeight = 110;
let headbuttFrameWidth;

// 角色狀態物件
let character = {
  x: 0,
  y: 0,
  isJumping: false,
  jumpDirection: 1, // 1: right, -1: left
  jumpFrame: 0,
  jumpSpeed: 25,
  isHeadbutting: false,
  headbuttFrame: 0,
  facingDirection: 1, // 1: right, -1: left
  originalY: 0,
};

// 在 setup() 之前執行，用來預載入圖片等資源
function preload() {
  walkSpriteSheet = loadImage('1/走路/合併.png');
  jumpSpriteSheet = loadImage('1/跳/合併.png');
  headbuttSpriteSheet = loadImage('1/頭頂/合併.png');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算所有動畫單一畫格的寬度
  walkFrameWidth = walkSpriteWidth / walkFrames;
  jumpFrameWidth = jumpSpriteWidth / jumpFrames;
  headbuttFrameWidth = headbuttSpriteWidth / headbuttFrames;

  // 初始化角色位置
  character.x = windowWidth / 2;
  character.y = windowHeight / 2;

  // 設定動畫播放速度
  frameRate(15); // 稍微降低幀率讓動畫節奏更清晰
}

function draw() {
  // 設定背景顏色
  background('#C2F8CB');

  if (character.isJumping) {
    // --- 跳躍動畫 ---
    push(); // 保存當前的繪圖狀態
    translate(character.x, character.y); // 將原點移動到角色位置
    scale(character.jumpDirection, 1); // 根據方向翻轉X軸

    // 繪製跳躍動畫的當前畫格
    image(jumpSpriteSheet, -jumpFrameWidth / 2, -jumpSpriteHeight / 2, jumpFrameWidth, jumpSpriteHeight, character.jumpFrame * jumpFrameWidth, 0, jumpFrameWidth, jumpSpriteHeight);
    pop(); // 恢復繪圖狀態

    // 更新跳躍動畫的畫格
    if (frameCount % 3 === 0) { // 每3個 draw() 迴圈更新一次跳躍畫格
      character.jumpFrame++;
      character.x += character.jumpSpeed * character.jumpDirection; // 移動角色

      // 如果跳躍動畫結束
      if (character.jumpFrame >= jumpFrames) {
        character.isJumping = false; // 結束跳躍狀態
        character.jumpFrame = 0; // 重置跳躍畫格
      }
    }
  } else if (character.isHeadbutting) {
    // --- 頭頂動畫 ---
    push();
    translate(character.x, character.y);
    scale(character.facingDirection, 1); // 根據角色朝向翻轉

    // 繪製頭頂動畫的當前畫格
    image(headbuttSpriteSheet, -headbuttFrameWidth / 2, -headbuttSpriteHeight / 2, headbuttFrameWidth, headbuttSpriteHeight, character.headbuttFrame * headbuttFrameWidth, 0, headbuttFrameWidth, headbuttSpriteHeight);
    pop();

    // 更新頭頂動畫畫格與位置
    if (frameCount % 2 === 0) { // 每2個 draw() 迴圈更新一次
      // 動畫前半段往上，後半段往下
      if (character.headbuttFrame < headbuttFrames / 2) {
        character.y -= 10; // 向上移動
      } else {
        character.y += 10; // 向下移動
      }

      character.headbuttFrame++;

      // 如果頭頂動畫結束
      if (character.headbuttFrame >= headbuttFrames) {
        character.isHeadbutting = false; // 結束頭頂狀態
        character.headbuttFrame = 0; // 重置畫格
        character.y = character.originalY; // 確保回到原始高度
      }
    }
  } else {
    // --- 走路動畫 (原地) ---
    push();
    translate(character.x, character.y);
    scale(character.facingDirection, 1); // 根據角色朝向翻轉
    let currentWalkFrame = floor(frameCount / 2) % walkFrames;
    image(walkSpriteSheet, -walkFrameWidth / 2, -walkSpriteHeight / 2, walkFrameWidth, walkSpriteHeight, currentWalkFrame * walkFrameWidth, 0, walkFrameWidth, walkSpriteHeight);
    pop();
  }
}

// 當鍵盤按下時觸發
function keyPressed() {
  // 如果角色不在任何動作中，才允許觸發新動作
  if (!character.isJumping && !character.isHeadbutting) {
    if (keyCode === RIGHT_ARROW) {
      character.isJumping = true;
      character.jumpDirection = 1; // 向右
      character.facingDirection = 1;
    } else if (keyCode === LEFT_ARROW) {
      character.isJumping = true;
      character.jumpDirection = -1; // 向左
      character.facingDirection = -1;
    } else if (keyCode === UP_ARROW) {
      character.isHeadbutting = true;
      character.originalY = character.y; // 儲存原始 Y 位置
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 如果不在任何動作中，將角色重新置中
  if (!character.isJumping && !character.isHeadbutting) {
      character.x = windowWidth / 2;
      character.y = windowHeight / 2;
  }
}
