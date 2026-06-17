/* =========================
   데이터
========================= */

const customers = [
    {
        name:"마녀",
        emoji:"🧙‍♀️",
        speech:"정확하게 만들어 주세요!"
    },
    {
        name:"마법사",
        emoji:"🧙‍♂️",
        speech:"실수는 용납하지 않네."
    },
    {
        name:"요정",
        emoji:"🧚",
        speech:"반짝이는 물약 부탁해!"
    },
    {
        name:"왕",
        emoji:"👑",
        speech:"최고 품질로 만들게."
    },
    {
        name:"드래곤",
        emoji:"🐉",
        speech:"강력한 물약을 원한다."
    }
];

const potions = [

{
name:"투명화 물약",
ingredients:[
"유니콘 털",
"달빛 가루",
"안개 버섯"
],
targetHeat:70
},

{
name:"비행 물약",
ingredients:[
"용의 비늘",
"하늘 꽃",
"바람 수정"
],
targetHeat:60
},

{
name:"행운 물약",
ingredients:[
"네잎클로버",
"황금 가루",
"별 조각"
],
targetHeat:50
},

{
name:"사랑 물약",
ingredients:[
"장미 꽃잎",
"달빛 가루",
"별 조각"
],
targetHeat:65
},

{
name:"힘 증가 물약",
ingredients:[
"용의 비늘",
"거인 콩",
"불꽃 열매"
],
targetHeat:85
},

{
name:"순간이동 물약",
ingredients:[
"안개 버섯",
"바람 수정",
"달빛 가루"
],
targetHeat:75
}

];

const ingredientPool = [

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
"불꽃 열매"

];

/* =========================
   상태
========================= */

let score = 0;
let gold = 0;
let level = 1;
let satisfaction = 100;

let timeLeft = 90;

let recipeVisibleTime = 5;

let currentPotion = null;

let selectedIngredients = [];

let phase = "ingredients";

/*
ingredients
stir
heat
finish
*/

let stirCount = 0;
let targetStirs = 3;

let heatValue = 0;

/* =========================
   DOM
========================= */

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const brewBtn =
document.getElementById("brewBtn");

const scoreEl =
document.getElementById("score");

const goldEl =
document.getElementById("gold");

const levelEl =
document.getElementById("level");

const satisfactionEl =
document.getElementById("satisfaction");

const timerEl =
document.getElementById("timer");

const customerEmoji =
document.getElementById("customerEmoji");

const customerName =
document.getElementById("customerName");

const customerSpeech =
document.getElementById("customerSpeech");

const potionName =
document.getElementById("potionName");

const recipeList =
document.getElementById("recipeList");

const recipeCountdown =
document.getElementById("recipeCountdown");

const ingredientsBox =
document.getElementById("ingredients");

const cauldronText =
document.getElementById("cauldronText");

const phaseText =
document.getElementById("phaseText");

const stirSection =
document.getElementById("stirSection");

const stirBtn =
document.getElementById("stirBtn");

const stirCountEl =
document.getElementById("stirCount");

const heatSection =
document.getElementById("heatSection");

const finishSection =
document.getElementById("finishSection");

const resultBox =
document.getElementById("result");

const targetHeatEl =
document.getElementById("targetHeat");

/* =========================
   UI
========================= */

function updateUI(){

    scoreEl.textContent =
    score;

    goldEl.textContent =
    gold;

    levelEl.textContent =
    level;

    satisfactionEl.textContent =
    satisfaction;

    timerEl.textContent =
    timeLeft;

}

/* =========================
   손님
========================= */

function randomCustomer(){

    const customer =
    customers[
        Math.floor(
            Math.random() *
            customers.length
        )
    ];

    customerEmoji.textContent =
    customer.emoji;

    customerName.textContent =
    customer.name;

    customerSpeech.textContent =
    customer.speech;

}

/* =========================
   재료 버튼
========================= */

function createIngredients(){

    ingredientsBox.innerHTML = "";

    ingredientPool.forEach(item=>{

        const btn =
        document.createElement(
            "button"
        );

        btn.className =
        "ingredient";

        btn.textContent =
        item;

        btn.addEventListener(
            "click",
            ()=>{

                if(
                    phase !==
                    "ingredients"
                ){
                    return;
                }

                if(
                    selectedIngredients
                    .length >= 3
                ){
                    return;
                }

                selectedIngredients
                .push(item);

                btn.disabled = true;

                updateCauldron();

                checkIngredientStep();

            }
        );

        ingredientsBox
        .appendChild(btn);

    });

}

/* =========================
   가마솥
========================= */

function updateCauldron(){

    if(
        selectedIngredients.length
        === 0
    ){

        cauldronText.textContent =
        "재료를 넣어주세요";

        return;
    }

    cauldronText.innerHTML =
    selectedIngredients.join(
        "<br>"
    );

}

/* =========================
   주문 생성
========================= */

function newOrder(){

    selectedIngredients = [];

    stirCount = 0;

    phase = "ingredients";

    phaseText.textContent =
    "현재 단계 : 재료 넣기";

    stirSection.classList.add(
        "hidden"
    );

    heatSection.classList.add(
        "hidden"
    );

    finishSection.classList.add(
        "hidden"
    );

    updateCauldron();

    createIngredients();

    randomCustomer();

    currentPotion =
    potions[
        Math.floor(
            Math.random() *
            potions.length
        )
    ];

    potionName.textContent =
    currentPotion.name;

    targetHeatEl.textContent =
    currentPotion.targetHeat;

    recipeList.innerHTML = "";

    currentPotion.ingredients
    .forEach(item=>{

        const li =
        document.createElement(
            "li"
        );

        li.textContent =
        item;

        recipeList.appendChild(li);

    });

    startRecipeTimer();

}

/* =========================
   주문서 숨김
========================= */

let recipeTimer;

function startRecipeTimer(){

    let count =
    recipeVisibleTime;

    recipeCountdown.textContent =
    `${count}초 후 주문서가 사라집니다`;

    clearInterval(
        recipeTimer
    );

    recipeTimer =
    setInterval(()=>{

        count--;

        recipeCountdown.textContent =
        `${count}초 후 주문서가 사라집니다`;

        if(count <= 0){

            clearInterval(
                recipeTimer
            );

            recipeList.innerHTML =
            "<li>❓ 기억해서 만들어보세요!</li>";

            recipeCountdown.textContent =
            "주문서가 사라졌습니다";

        }

    },1000);

}

/* =========================
   순서 검사
========================= */

function checkIngredientStep(){

    if(
        selectedIngredients.length
        < 3
    ){
        return;
    }

    const correct =
    JSON.stringify(
        selectedIngredients
    ) ===
    JSON.stringify(
        currentPotion.ingredients
    );

    if(!correct){

        resultBox.className =
        "resultBox fail";

        resultBox.textContent =
        "💥 재료 순서가 틀렸습니다!";

        satisfaction -= 10;

        if(
            satisfaction < 0
        ){
            satisfaction = 0;
        }

        updateUI();

        setTimeout(()=>{

            resultBox.textContent =
            "";

            newOrder();

        },1500);

        return;
    }

    phase = "stir";

    phaseText.textContent =
    "현재 단계 : 젓기";

    stirSection.classList.remove(
        "hidden"
    );

}
/* =========================
   젓기 단계
========================= */

stirBtn.addEventListener("click", () => {

    if (phase !== "stir") {
        return;
    }

    stirCount++;

    stirCountEl.textContent =
        stirCount;

    if (stirCount < targetStirs) {
        return;
    }

    phase = "heat";

    phaseText.textContent =
        "현재 단계 : 가열";

    stirSection.classList.add(
        "hidden"
    );

    heatSection.classList.remove(
        "hidden"
    );

    startHeatGame();

});

/* =========================
   가열 미니게임
========================= */

const heatBtn =
document.getElementById(
    "heatBtn"
);

const heatPointer =
document.getElementById(
    "heatPointer"
);

let heatInterval = null;

let heatDirection = 1;

function startHeatGame(){

    heatValue = 0;

    heatPointer.style.left =
        "0px";

    clearInterval(
        heatInterval
    );

    heatInterval =
    setInterval(()=>{

        heatValue +=
        heatDirection * 2;

        if(
            heatValue >= 100
        ){
            heatDirection = -1;
        }

        if(
            heatValue <= 0
        ){
            heatDirection = 1;
        }

        heatPointer.style.left =
        `${heatValue}%`;

    },20);

}

heatBtn.addEventListener(
"click",
()=>{

    if(
        phase !== "heat"
    ){
        return;
    }

    clearInterval(
        heatInterval
    );

    const diff =
    Math.abs(
        heatValue -
        currentPotion.targetHeat
    );

    if(diff > 15){

        resultBox.className =
        "resultBox fail";

        resultBox.textContent =
        "🔥 온도 조절 실패!";

        satisfaction -= 15;

        if(
            satisfaction < 0
        ){
            satisfaction = 0;
        }

        updateUI();

        setTimeout(()=>{

            resultBox.textContent =
            "";

            newOrder();

        },1500);

        return;
    }

    phase = "finish";

    phaseText.textContent =
    "현재 단계 : 완성";

    heatSection.classList.add(
        "hidden"
    );

    finishSection.classList.remove(
        "hidden"
    );

});
/* =========================
   완성
========================= */

const finishBtn =
document.getElementById(
    "finishBtn"
);

finishBtn.addEventListener(
"click",
()=>{

    if(
        phase !== "finish"
    ){
        return;
    }

    finishPotion();

});

function finishPotion(){

    const bonus =
    Math.max(
        0,
        20 -
        Math.abs(
            heatValue -
            currentPotion.targetHeat
        )
    );

    const reward =
    20 + bonus;

    score += reward;

    gold += 30;

    satisfaction += 3;

    if(
        satisfaction > 100
    ){
        satisfaction = 100;
    }

    resultBox.className =
    "resultBox success";

    resultBox.textContent =
    `✨ 성공! +${reward}점`;

    updateLevel();

    updateUI();

    setTimeout(()=>{

        resultBox.textContent =
        "";

        finishSection.classList.add(
            "hidden"
        );

        newOrder();

    },1800);

}

/* =========================
   레벨
========================= */

function updateLevel(){

    if(score >= 300){

        level = 4;

        unlockAchievement(
            "전설의 연금술사"
        );

    }

    else if(score >= 180){

        level = 3;

        unlockAchievement(
            "숙련 마법사"
        );

    }

    else if(score >= 80){

        level = 2;

        unlockAchievement(
            "견습 마법사 졸업"
        );

    }

}

/* =========================
   업적
========================= */

const achievementList =
document.getElementById(
    "achievementList"
);

const unlocked =
new Set();

function unlockAchievement(
name
){

    if(
        unlocked.has(name)
    ){
        return;
    }

    unlocked.add(name);

    if(
        achievementList.innerHTML.includes(
            "아직 업적 없음"
        )
    ){
        achievementList.innerHTML =
        "";
    }

    const li =
    document.createElement(
        "li"
    );

    li.textContent =
    "🏅 " + name;

    achievementList.appendChild(
        li
    );

}

/* =========================
   상점
========================= */

const buyMemory =
document.getElementById(
    "buyMemory"
);

const buyTime =
document.getElementById(
    "buyTime"
);

const buySatisfaction =
document.getElementById(
    "buySatisfaction"
);

buyMemory.addEventListener(
"click",
()=>{

    if(gold < 100){

        alert(
            "골드가 부족합니다."
        );

        return;
    }

    gold -= 100;

    recipeVisibleTime += 2;

    updateUI();

});

buyTime.addEventListener(
"click",
()=>{

    if(gold < 150){

        alert(
            "골드가 부족합니다."
        );

        return;
    }

    gold -= 150;

    timeLeft += 10;

    updateUI();

});

buySatisfaction.addEventListener(
"click",
()=>{

    if(gold < 120){

        alert(
            "골드가 부족합니다."
        );

        return;
    }

    gold -= 120;

    satisfaction += 20;

    if(
        satisfaction > 100
    ){
        satisfaction = 100;
    }

    updateUI();

});

/* =========================
   타이머
========================= */

let gameTimer;

function startTimer(){

    clearInterval(
        gameTimer
    );

    gameTimer =
    setInterval(()=>{

        timeLeft--;

        updateUI();

        if(
            timeLeft <= 0
        ){

            endGame();

        }

    },1000);

}

/* =========================
   저장
========================= */

function getBestScore(){

    return Number(
        localStorage.getItem(
            "magicPotionBest"
        )
    ) || 0;

}

function saveBestScore(){

    if(
        score >
        getBestScore()
    ){

        localStorage.setItem(
            "magicPotionBest",
            score
        );

    }

}

/* =========================
   게임 종료
========================= */

const startScreen =
document.getElementById(
    "startScreen"
);

const gameScreen =
document.getElementById(
    "gameScreen"
);

const gameOverScreen =
document.getElementById(
    "gameOverScreen"
);

const finalScore =
document.getElementById(
    "finalScore"
);

const bestScore =
document.getElementById(
    "bestScore"
);

function endGame(){

    clearInterval(
        gameTimer
    );

    saveBestScore();

    finalScore.textContent =
    score;

    bestScore.textContent =
    getBestScore();

    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.remove(
        "hidden"
    );

}

/* =========================
   게임 시작
========================= */

function startGame(){

    score = 0;
    gold = 0;
    level = 1;

    satisfaction = 100;

    timeLeft = 90;

    recipeVisibleTime = 5;

    unlocked.clear();

    achievementList.innerHTML =
    "<li>아직 업적 없음</li>";

    updateUI();

    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

    startTimer();

    newOrder();

}

startBtn.addEventListener(
"click",
startGame
);

restartBtn.addEventListener(
"click",
startGame
);
