const formAddTask = document.querySelector(".task__add-task-form");
const btAddTask = document.querySelector(".add__new__task__button-add-button");
const textArea = document.querySelector("#task__add-textarea");
const btTextAreaDelete = document.getElementById("task__button-delete");
const btTextAreaCancel = document.getElementById("task__button-cancel");
const btTextAreaSave = document.getElementById("task__button-save"); // VERIFICAR SE ESTA UTILIZANDO ESTE BOTAO
const ulTask = document.querySelector(".task__list-items");
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const formTitle = document.querySelector(".task__add-task-title");
const textButtonSaveUpdate = document.querySelector(".button__save-text");
const btScrollTop = document.querySelector("#task__scroll__top");
const btScrollDown = document.querySelector("#task__scroll__down");
let saveUpdateFlag = "S"; // S = Save / U = Update
let id = 0;
let paragraphiD;
let scroll = 0;

const coinSound = new Audio("../assets/music/coin.wav");
const interfaceSound = new Audio("../assets/music/interface.mp3");
const levelUpSound = new Audio("../assets/music/levelUp.mp3");
const upSound = new Audio("../assets/music/up.wav");
const eraserSound = new Audio("../assets/music/eraser.mp3");
const successUpdateSound = new Audio("../assets/music/success_update.mp3");
const popSaveSound = new Audio("../assets/music/pop_save.mp3");
const babySqueakToySound = new Audio("../assets/music/baby_squeak_toy.mp3");


function saveUpdateTask(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

btAddTask.addEventListener("click",() => {
    formAddTask.classList.toggle("hidden");
    formTitle.textContent = "Add tasks";
    textButtonSaveUpdate.textContent = 'Save';
    textArea.value = "";
    saveUpdateFlag = "S";
});

formAddTask.addEventListener("submit", (event) => {
    event.preventDefault(); //Retira o comportamento padrao do form
    if((textArea.value.trim()) && (saveUpdateFlag == "S")){
        const task = {
            description: textArea.value,
            status: 'NC'
        };
        tasks.push(task);
        const taskElement = createTaskElementList(task);
        ulTask.append(taskElement);
        saveUpdateTask();
        textArea.value = "";
        updateProgressTask(tasks);
        popSaveAudio();
    }else if((textArea.value.trim()) && (saveUpdateFlag == "U")){
        const paragraph = document.getElementById(paragraphiD);
        
        if ((textArea.value != paragraph.textContent) && (tasks[paragraphiD].status != "CO")){
            paragraph.textContent = textArea.value;
            const task = {
                description: textArea.value,
                status: 'NC'
            };
            tasks[paragraphiD] = task;
            saveUpdateTask();
            updateProgressTask(tasks);
            successUpdateAudio();
        };
    };
});

function createTaskElementList(task){
    const li = document.createElement("li");
    
    li.classList.add("task__item");
    li.setAttribute("id", `task${id}`);
    
    const div = document.createElement("div");
    div.classList.add("task__list-check");

    const buttonCheck = document.createElement("button");
    buttonCheck.classList.add("task__list-edit-icon");
    let imgButtonCheck = document.createElement("img");

    if(task.status == "NC"){
        imgButtonCheck.setAttribute("src", "./assets/img/icones/check_white.png");
        li.classList.add("task__list-item-pending");
    }else{
        imgButtonCheck.setAttribute("src", "./assets/img/icones/check_green.png");
        li.classList.add("task__list-item-complete");
    };

    const paragraphTaskDescription = document.createElement("p");
    paragraphTaskDescription.setAttribute("class", "task__text-overflow");
    paragraphTaskDescription.setAttribute("id", id);

    resizeTaskDiv();
    showHiddenScrollButtons();

    id = redefineIdFlow(id, "+");
    
    paragraphTaskDescription.textContent = task.description;

    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("task__list-edit-icon");
    buttonEdit.classList.add("task__list-edit-icon-ed");

    const imgButtonEdit = document.createElement("img");
    imgButtonEdit.setAttribute("src", "./assets/img/icones/edit.png");
    imgButtonEdit.classList.add("task__list-edit-icon-img");

    buttonCheck.onclick = ()=> {
    
        const checkBt = imgButtonCheck.src;

        if (checkBt.includes("check_white")){ // CHECK IF THE STRING IS INSIDE OF THE STRING
            li.classList.toggle("task__list-item-pending");
            li.classList.add("task__list-item-complete");
            imgButtonCheck.setAttribute("src", "./assets/img/icones/check_green.png");
            task.status = "CO";
            tasks[paragraphTaskDescription.getAttribute('id')] = task;
            saveUpdateTask();
            updateProgressTask(tasks);
            //VALIDATE THE SOUND
            let indx = 0;
            tasks.forEach(taskItem => {
                if (taskItem.status == "CO"){
                    ++indx;
                };  
            });

            if (indx < tasks.length ){
                coinAudio();
            };
            
        }else{
            imgButtonCheck.setAttribute("src", "./assets/img/icones/check_white.png");
            li.classList.toggle("task__list-item-complete");
            li.classList.add("task__list-item-pending");
            task.status = "NC";
            saveUpdateTask();
            updateProgressTask(tasks);
            levelUpAudio();
        };
    };

    buttonEdit.onclick = ()=>{
        if(formAddTask.classList.contains("hidden")){
            formAddTask.classList.toggle("hidden");
            formTitle.textContent = "Edit task";
            textArea.value = paragraphTaskDescription.textContent;
            textButtonSaveUpdate.textContent = "Update";
            saveUpdateFlag = "U";
            paragraphiD = paragraphTaskDescription.getAttribute("id");
            interfaceAudio();
        }else if(formTitle.textContent != "Edit task"){
            formTitle.textContent = "Edit task";
            textArea.value = paragraphTaskDescription.textContent;
            textButtonSaveUpdate.textContent = "Update";
            saveUpdateFlag = "U";
            paragraphiD = paragraphTaskDescription.getAttribute("id");
            interfaceAudio();
        }else if((formTitle.textContent == "Edit task") && (paragraphTaskDescription.textContent != textArea.value)){
            textArea.value = paragraphTaskDescription.textContent;
            paragraphiD = paragraphTaskDescription.getAttribute("id");
        }else{
            formAddTask.classList.toggle("hidden");
            interfaceAudio();
        };
    };    

    buttonCheck.append(imgButtonCheck);
    div.append(buttonCheck);
    div.append(paragraphTaskDescription);
    buttonEdit.append(imgButtonEdit);
    
    li.append(div);
    li.append(buttonEdit);

    return li;
};


//READ DE LOCALSTORAGE AND BRING THE REGISTERS TO DISPLAY IN THE SCREEN
tasks.forEach(task => {
    const taskElement = createTaskElementList(task);
    ulTask.append(taskElement);
}); 
updateProgressTask(tasks);


btTextAreaDelete.addEventListener("click",() => {
    if(textArea.value.trim()){ 
        const confirmPopUp = createPopUp();
        const divForm = document.querySelector("#task__add-task-form-box");
        divForm.insertBefore(confirmPopUp, formTitle);
        const popUpBox = document.querySelector("#popup");
        const divButtons = document.querySelector(".popup__div__buttons");
        const btYes = document.getElementById("btYes");
        const btCancel = document.getElementById("btCancel");

        //VERIFY THE SIZE OF FORM
        let divSize = divForm.clientWidth;

        //CHANGE THE SIZE OF THE POPUP SCREEN
        if(divSize > 300){
            popUpBox.style.width = "555px";
            popUpBox.style.height = "230px";
            popUpBox.style.flexDirection = "column";
            popUpBox.style.alignItems = "center";
            divButtons.style.marginTop = "90px";
            
            btYes.style.width = "40%";
            btYes.style.height = "50px";
            btCancel.style.width = "40%";
            btCancel.style.height = "50px";
        };

        btYes.onclick = ()=> {
            textArea.value = "";
            //saveUpdateFlag = "D"; // verificar se precisa desta flag ou se poder excluir
            tasks.splice(paragraphiD,1);
            saveUpdateTask();
            const taskItem = document.getElementById(`task${paragraphiD}`);
            taskItem.parentNode.removeChild(taskItem);
            popUpBox.parentNode.removeChild(popUpBox);
            reOrganizeTasksIds();
            updateProgressTask(tasks);
            resizeTaskDiv();
            showHiddenScrollButtons();
            //CONTROL THE FLOW TO CREATE NEW LIST ITENS
            id = redefineIdFlow(id, "-");
            
            eraserAudio();
        };

        btCancel.onclick = ()=>{
            popUpBox.parentNode.removeChild(popUpBox);
        };
    };

});

//FUNCTION TO RE-ORGANIZE THE TASKS ID NUMBERS
function reOrganizeTasksIds(){
    const liTasks = document.getElementsByClassName("task__item");
    const paragraphTask = document.querySelectorAll(".task__text-overflow");
    let indx = 0;
    if(liTasks.length > 0){
        for(indx; indx <= liTasks.length - 1; indx ++){
            liTasks[indx].setAttribute("id", `task${indx}`);
            paragraphTask[indx].setAttribute("id",indx);
        };
    };  
};

function redefineIdFlow(id, operator){
    if(operator == "-"){
        return --id;
    }else{
        return ++id;
    };
};

function resizeTaskDiv(){
    const taskDiv = document.querySelector(".task__list__container");
    let size = 76 * tasks.length;
    size <= 380 ? taskDiv.style.height = `${size}px` : taskDiv.style.height = '380px';
};

function showHiddenScrollButtons(){
    
    if ((tasks.length - 1) > 4){
        const scrollButtons = document.querySelector(".task__scroll-buttons");
        scrollButtons.classList.remove("hidden");
    }else if((tasks.length - 1) <= 4){
        const scrollButtons = document.querySelector(".task__scroll-buttons");
        scrollButtons.classList.add("hidden");
    };
};

//FUNCTION UPDATE PROGRESS TASK
function updateProgressTask(tasks){
    if(tasks[0] == undefined){
        const progressTask = document.querySelector("#task__status-description-name");
        progressTask.textContent = "Name of the task in progress";
    }else{
        let totalCO = 0;
        for (i=0;i <= tasks.length - 1; i++){
            if(tasks[i].status == "CO"){
                ++totalCO;
            };
        };

        if(totalCO == tasks.length){
            const progressTask = document.querySelector("#task__status-description-name");
            progressTask.textContent = "Congratulations! You have completed all your tasks. Enjoy the rest of your day.";
            upAudio();
        }else{
            let taskList = document.querySelector(".task__list-item-pending"); 
            //TREATMENT FOR RETURNED CLASS NULL
            if(taskList == null){
                taskList = document.querySelector(".task__list-item-complete");
            };
            const indexTaskProgress = taskList.getAttribute("id");
            const progressTask = document.querySelector("#task__status-description-name");
            progressTask.textContent = tasks[indexTaskProgress.slice(4)].description;
        };
    };
};

// CLEAN AND HIDDEN THE FORM
btTextAreaCancel.addEventListener("click",()=>{
    textArea.value = "";
    formAddTask.classList.toggle("hidden");
    babySqueakToyAudio();
});

function createPopUp(){
    const div = document.createElement("div");
    div.setAttribute("id", "popup");
    div.classList.toggle("popupBox");
    
    const p = document.createElement("p");
    p.textContent = "Would you like to delete the task?";

    const divButtons = document.createElement("div");
    divButtons.setAttribute("class", "popup__div__buttons");

    const buttonYes = document.createElement("button");
    buttonYes.setAttribute("id", "btYes");
    buttonYes.setAttribute("class", "popupButtons");
    buttonYes.setAttribute("value", "1");
    const labelYes = document.createElement("p");
    labelYes.textContent = "YES";

    const buttonCancel = document.createElement("button");
    buttonCancel.setAttribute("id", "btCancel");
    buttonCancel.setAttribute("class", "popupButtons");
    buttonCancel.setAttribute("value", "2");
    const labelCancel = document.createElement("p");
    labelCancel.textContent = "Cancel";

    buttonYes.append(labelYes);
    buttonCancel.append(labelCancel);

    div.append(p);
    divButtons.append(buttonYes);
    divButtons.append(buttonCancel);
    div.append(divButtons);

    return div;
};

function coinAudio(){
    coinSound.play();
    coinSound.volume = 0.3;
};

function interfaceAudio(){
    interfaceSound.play();
    interfaceSound.volume = 0.3;
};

function levelUpAudio(){
    levelUpSound.play();
    levelUpSound.volume = 0.3;
};

function upAudio(){
    upSound.play();
    upSound.volume = 0.4;
};

function eraserAudio(){
    eraserSound.play();
    eraserSound.volume = 0.3;
};

function successUpdateAudio(){
    successUpdateSound.play();
    successUpdateSound.volume = 0.3;
};

function popSaveAudio(){
    popSaveSound.play();
    popSaveSound.volume = 0.5;
};

function babySqueakToyAudio(){
    babySqueakToySound.play();
    babySqueakToySound.volume = 0.3;
}


btScrollTop.onclick = ()=>{
    const scrollScreen = document.querySelector(".task__list__container");
    if(scroll > 0){
        scroll -= 76;
    };
    scrollScreen.scroll(0, scroll);
};

btScrollDown.onclick = ()=>{
    const scrollScreen = document.querySelector(".task__list__container");
    if(scroll < (76 * (tasks.length - 5))){
        scroll += 76;
    };
    scrollScreen.scroll(0, scroll);
};
