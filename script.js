const customers = [
    { name:"마녀", emoji:"🧙‍♀️" },
    { name:"마법사", emoji:"🧙‍♂️" },
    { name:"요정", emoji:"🧚" },
    { name:"왕", emoji:"👑" },
    { name:"드래곤", emoji:"🐉" }
];

const potions = [
    {name:"투명화 물약", ingredients:["유니콘 털","달빛 가루","안개 버섯"]},
    {name:"비행 물약", ingredients:["용의 비늘","하늘 꽃","바람 수정"]},
    {name:"행운 물약", ingredients:["네잎클로버","황금 가루","별 조각"]},
    {name:"사랑 물약", ingredients:["장미 꽃잎","달빛 가루","별 조각"]},
    {name:"힘 증가 물약", ingredients:["용의 비늘","거인 콩","불꽃 열매"]},
    {name:"천둥 물약", ingredients:["번개 수정","별 조각","바람 수정"]},
    {name:"불멸 물약", ingredients:["황금 가루","유니콘 털","별 조각"]},
    {name:"순간이동 물약", ingredients:["안개 버섯","바람 수정","달빛 가루"]},
    {name:"시간여행 물약", ingredients:["별 조각","달빛 가루","번개 수정"]},
    {name:"드래곤 물약", ingredients:["용의 비늘","불꽃 열매","황금 가루"]},
    {name:"지혜 물약", ingredients:["네잎클로버","달빛 가루","하늘 꽃"]},
    {name:"변신 물약", ingredients:["안개 버섯","장미 꽃잎","유니콘 털"]}
];

const allIngredients = [
    "유니콘 털",
    "달빛 가루",
    "안개 버섯",
    "용의 비늘",
    "하늘 꽃",
    "바람 수정",
    "네잎클로버",
    "황금 가루",
    "별 조각",
    "장미 꽃잎",
    "거인 콩",
    "불꽃 열매",
    "번개 수정"
];

let score = 0;
let gold = 0;
let level = 1;
let combo = 0;
let timeLeft = 60;

let scoreMultiplier = 1;

let timer;
let gameRunning = false;

let selected = [];
let currentPotion = null;

const achievements = new Set();

/* 요소 */

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const brewBtn = document.getElementById("brewBtn");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const scoreEl = document.getElementById("score");
const goldEl = document.getElementById("gold");
const levelEl = document.getElementById("level");
const comboEl = document.getElementById("combo");
const timerEl = document.getElementById("timer");

const customerEmoji = document.getElementById("customerEmoji");
const customerName = document.getElementById("customerName");

const orderText = document.getElementById("orderText");
const ingredientsBox = document.getElementById("ingredients");
const selectedText = document.getElementById("selectedText");
const result = document.getElementById("result");

const stars = document.getElementById("stars");

const highScoreEl = document.getElementById("bestScore");
const finalScoreEl = document.getElementById("finalScore");

const achievementList =
document.getElementById("achievementList");

/* 최고점수 */

function getBestScore(){
    return Number(
        localStorage.getItem("magicBestScore")
    ) || 0;
}

function saveBestScore(){

    if(score > getBestScore()){

        localStorage.setItem(
            "magicBestScore",
            score
        );

    }

}

/* 업적 */

function unlockAchievement(text){

    if(achievements.has(text)) return;

    achievements.add(text);

    if(
        achievementList.children.length === 1 &&
        achievementList.children[0].textContent ===
        "아직 업적 없음"
    ){
        achievementList.innerHTML = "";
    }

    const li = document.createElement("li");
    li.textContent = "🏅 " + text;

    achievementList.appendChild(li);
}

/* 레벨 */

function updateLevel(){

    if(score >= 100){
        level = 3;
    }
    else if(score >= 50){
        level = 2;
    }
    else{
        level = 1;
    }

    levelEl.textContent = level;
}

/* 손님 */

function randomCustomer(){

    const c =
    customers[
        Math.floor(
            Math.random()*customers.length
        )
    ];

    customerEmoji.textContent = c.emoji;
    customerName.textContent = c.name;
}

/* 재료 */

function createIngredients(){

    ingredientsBox.innerHTML = "";

    allIngredients.forEach(item=>{

        const btn =
        document.createElement("button");

        btn.className = "ingredient";
        btn.textContent = item;

        btn.onclick = ()=>{

            if(!gameRunning) return;

            if(selected.includes(item)){

                selected =
                selected.filter(
                    i=>i!==item
                );

                btn.classList.remove(
                    "selected"
                );

            }else{

                if(selected.length >= 3){

                    alert(
                        "재료는 3개만 선택 가능합니다."
                    );

                    return;
                }

                selected.push(item);

                btn.classList.add(
                    "selected"
                );

            }

            selectedText.textContent =
            selected.join(", ") || "없음";

        };

        ingredientsBox.appendChild(btn);

    });

}

/* 주문 */

function newOrder(){

    selected = [];

    document
    .querySelectorAll(".ingredient")
    .forEach(btn=>{
        btn.classList.remove("selected");
    });

    selectedText.textContent = "없음";

    currentPotion =
    potions[
        Math.floor(
            Math.random()*potions.length
        )
    ];

    orderText.textContent =
    currentPotion.name + "을 만들어 주세요!";

    randomCustomer();

}

/* UI */

function updateUI(){

    scoreEl.textContent = score;
    goldEl.textContent = gold;
    comboEl.textContent = combo;
    timerEl.textContent = timeLeft;

    updateLevel();

}

/* 제조 */

function brewPotion(){

    if(selected.length !== 3){

        alert(
            "재료를 정확히 3개 선택하세요."
        );

        return;
    }

    const correct =

    selected.every(
        i=>
        currentPotion.ingredients.includes(i)
    )

    &&

    currentPotion.ingredients.every(
        i=>
        selected.includes(i)
    );

    if(correct){

        combo++;

        let gained =
        (10 + combo*2)
        * scoreMultiplier;

        score += gained;

        gold += 20;

        timeLeft += 2;

        result.className =
        "result success";

        result.textContent =
        `✨ 성공! +${gained}점`;

        stars.textContent =
        combo >= 5
        ? "⭐⭐⭐⭐⭐"
        : "⭐⭐⭐";

        if(combo === 1){
            unlockAchievement(
                "첫 성공"
            );
        }

        if(combo === 5){
            unlockAchievement(
                "5연속 성공"
            );
        }

    }else{

        combo = 0;

        score -= 5;

        gold -= 10;

        timeLeft -= 3;

        if(gold < 0){
            gold = 0;
        }

        if(timeLeft < 0){
            timeLeft = 0;
        }

        stars.textContent = "⭐";

        result.className =
        "result fail";

        result.textContent =
        "💥 실패!";
    }

    if(score >= 50){
        unlockAchievement(
            "50점 달성"
        );
    }

    if(score >= 100){
        unlockAchievement(
            "100점 달성"
        );
    }

    updateUI();

    setTimeout(()=>{

        if(gameRunning){

            result.textContent = "";

            newOrder();

        }

    },1000);

}

/* 타이머 */

function startTimer(){

    timer = setInterval(()=>{

        timeLeft--;

        timerEl.textContent =
        timeLeft;

        if(timeLeft <= 0){

            endGame();

        }

    },1000);

}

/* 게임 종료 */

function endGame(){

    gameRunning = false;

    clearInterval(timer);

    saveBestScore();

    finalScoreEl.textContent =
    score;

    highScoreEl.textContent =
    getBestScore();

    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.remove(
        "hidden"
    );

}

/* 시작 */

function startGame(){

    score = 0;
    gold = 0;
    level = 1;
    combo = 0;

    timeLeft = 60;

    scoreMultiplier = 1;

    achievements.clear();

    achievementList.innerHTML =
    "<li>아직 업적 없음</li>";

    gameRunning = true;

    updateUI();

    createIngredients();

    newOrder();

    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

    clearInterval(timer);

    startTimer();

}

/* 상점 */

document
.getElementById("buyTime")
.onclick = ()=>{

    if(gold < 100){

        alert(
            "골드가 부족합니다."
        );

        return;
    }

    gold -= 100;

    timeLeft += 10;

    updateUI();

};

document
.getElementById("buyDouble")
.onclick = ()=>{

    if(gold < 200){

        alert(
            "골드가 부족합니다."
        );

        return;
    }

    gold -= 200;

    scoreMultiplier = 2;

    updateUI();

};

/* 버튼 */

startBtn.onclick =
startGame;

restartBtn.onclick =
startGame;

brewBtn.onclick =
brewPotion;
