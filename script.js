function reset(event){

    event.preventDefault();
    let body = document.body;

    
    body.innerHTML = '';

    let newContent = `
        <form id="tasksForm">

        <div class="mainTaskInput">
            <label for="mainTask">Main Task:</label>
            <input type="text" id="mainTask" name="mainTaskName" required>
            <label for="mainTaskDuration">Main Task duration(min):</label>
            <input type="number" id="mainTaskDuration" name="mainTaskDuration"  min="1" max="1440" required>
        </div>

        <div class="subTaskInput">
            <label for="subtask">subtask:</label>
            <input type="text" id="subTask" name="subTaskName" required>
    
            <label for="subTaskDuration">subtask duration(min):</label>
            <input type="number" id="subTaskDuration" name="subTaskDuration" required>
        </div>
    
        <button type="submit" class="submitMainBtn">Submit</button>
        <button type="submit" class="submitSubBtn">Submit</button>
        <button type="reset" class="resetBtn">Reset</button>
        
    </form>

    <div class="displayed">
        <div class="displayedMain">
            
            <div class="displayedSub">
                <ol id="listOfSubTasks"></ol>
            </div>
        </div>
    </div>

 
    <script src="script.js"></script>
    `;
    body.innerHTML = newContent;
    const submitMainBtn = document.querySelector('.submitMainBtn');
    submitMainBtn.addEventListener('click', submitMain);  

    const submitSubBtn = document.querySelector('.submitSubBtn');
    submitSubBtn.addEventListener('click', submitSub);

    const resetBtn = document.querySelector('.resetBtn');
    resetBtn.addEventListener('click', reset); 

    

}

function mainTaskNameIsValid(){
    const mainTaskName = document.getElementById('mainTask').value.trim();
    if (mainTaskName === '') {
        alert(`pls enter the main task name`);
        return false;
    }
    if (mainTaskName.length > 100) {
        alert(`Task name cannot exceed 100 characters.`);
        return false;
    }
    return true;
}

function mainTaskDurationIsValid(){
    const mainTaskDuration = document.getElementById('mainTaskDuration').value;

    if (!Number.isInteger(+mainTaskDuration) || mainTaskDuration < 1 || mainTaskDuration > 1440) {
        alert(`Please enter an integer between 1 and 1440.`);
        return false;
    }

    return true;
}

function mainInputIsValid(){
    
    if(mainTaskNameIsValid()  && mainTaskDurationIsValid()){
        return true;
    }
    return false;
}

function renderMain(){
    const displayedMainDiv = document.querySelector('.displayedMain');
    const mainNameFromInput = document.getElementById('mainTask').value;
    const mainDurFromInput = document.getElementById('mainTaskDuration').value;

    const newHtmlContent = `
        <div class="mainName">
            <h4>Main task name: ${mainNameFromInput}</h4>
        </div>

        <div class="mainDur">
            <h4>Main task duration: ${mainDurFromInput}</h4>
        </div>

        <div id="unallocated">
            <h4>unallocated minutes: ${mainDurFromInput}</h4>
        </div>
        `;

    displayedMainDiv.insertAdjacentHTML('afterbegin', newHtmlContent);

    


}

function hideMainInput(){
    const mainTaskInput = document.querySelector('.mainTaskInput');
    mainTaskInput.style.display='none';
}

function hideMainSubmitBtn(){
    const submitMainBtn = document.querySelector('.submitMainBtn');
    submitMainBtn.style.display ='none';
}

function showSubInput(){
    const subTaskInput = document.querySelector('.subTaskInput');
    subTaskInput.style.display = 'block';
}

function showSubSubmitBtn(){
    const submitSubBtn = document.querySelector('.submitSubBtn');
    submitSubBtn.style.display='block';
}

function renderSubtasksTitle(){
    const displayedSubDiv = document.querySelector('.displayedSub');
    const newHtmlContent=`<h4>Subtasks:</h4>`
    displayedSubDiv.insertAdjacentHTML('afterbegin', newHtmlContent);
}

function submitMain(event){

    event.preventDefault();
    if (mainInputIsValid()){
        renderMain();
        hideMainInput();
        hideMainSubmitBtn();
        showSubInput();
        showSubSubmitBtn();
        renderSubtasksTitle();

        const submitMainBtn = document.querySelector('.submitMainBtn');
        submitMainBtn.disabled = true;
    } 
}


function subtaskNameIsValid(){
    const subTaskName = document.getElementById('subTask').value.trim();
    if (subTaskName === '') {
        alert(`pls enter the subtask name`);
        return false;
    }
    if (subTaskName.length > 100) {
        alert(`subtask name cannot exceed 100 characters.`);
        return false;
    }
    return true;
}


function subtaskDurationIsInt(subtaskDuration){
    return (typeof subtaskDuration === 'number' && Number.isInteger(subtaskDuration)) ||
    (typeof subtaskDuration === 'string' && !isNaN(subtaskDuration) && Number.isInteger(parseFloat(subtaskDuration)));
}


function getUnallocated(){
    let unallocatedText = document.querySelector('#unallocated h4').textContent;

    let unallocatedMinutes = unallocatedText.match(/\d+/);

    unallocatedMinutes = unallocatedMinutes ? parseInt(unallocatedMinutes[0], 10) : null;

    return unallocatedMinutes;
}

function subtaskDurationIsValid(){
    const subtaskDuration = document.getElementById('subTaskDuration').value;
    const unallocated = getUnallocated();

    if(!subtaskDurationIsInt(subtaskDuration)){
        alert(`subtask duration must be an integer`);
        return false;
    }

    if(subtaskDuration<1){
        alert(`subtask duration cannot be less than 1 min`);
        return false;
    }

    if(subtaskDuration > unallocated){
        alert(`subtask duration must be less than or equal to the unallocated minutes`);
        return false;
    }

    return true;
}



let interval;


function startTimer(timerSpan, listItem) {
    clearInterval(interval);

    // Use the current remaining time or the original duration if this is the first start
    let timeRemaining = listItem.timeRemaining !== undefined ? listItem.timeRemaining : listItem.originalDuration;

    interval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(interval);
            timerSpan.textContent = "Time's up!";
        } else {
            timeRemaining--;
            timerSpan.textContent = formatTime(timeRemaining);
        }
        listItem.timeRemaining = timeRemaining;
    }, 1000);
}

function markAsDone(nameSpan, timerSpan, listItem) {
    clearInterval(interval);

    // Strikethrough the task name
    nameSpan.style.textDecoration = "line-through";

    // Calculate remaining time
    const remainingTime = listItem.timeRemaining;

    // Find the next subtask and add the remaining time to it
    const nextListItem = listItem.nextElementSibling;
    if (nextListItem) {
        const nextTimerSpan = nextListItem.querySelector('span:nth-child(2)');
        const nextDuration = parseTime(nextTimerSpan.textContent);
        const newDuration = nextDuration + remainingTime;

        nextListItem.timeRemaining = newDuration;
        nextTimerSpan.textContent = formatTime(newDuration);
    }
}


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function parseTime(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}


function renderSubTask(){
    const subtaskName = document.getElementById('subTask').value;
    const subtaskDurationInMinutes = parseInt(document.getElementById('subTaskDuration').value, 10);
    const subtaskDurationInSeconds = subtaskDurationInMinutes*60;

    const listItem = document.createElement('li');
    listItem.className = 'subtask';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = subtaskName;
    listItem.appendChild(nameSpan);

    const timerSpan = document.createElement('span');
    timerSpan.textContent = formatTime(subtaskDurationInSeconds);
    listItem.appendChild(timerSpan);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.addEventListener('click', function() {
        startTimer(timerSpan, listItem);
        startButton.disabled=true;
        
    });
    listItem.appendChild(startButton);

    const doneButton = document.createElement('button');
    doneButton.textContent = 'Done';
    doneButton.addEventListener('click', function() {
        markAsDone(nameSpan, timerSpan, listItem);
        doneButton.disabled=true;
        
    });
    listItem.appendChild(doneButton);

    listItem.originalDuration = subtaskDurationInSeconds;

    document.getElementById('listOfSubTasks').appendChild(listItem);
}

function updateUnallocated(){
    const subtaskDurationInMinutes = parseInt(document.getElementById('subTaskDuration').value, 10);
    const currentUnallocated = getUnallocated();
    const newUnallocated = currentUnallocated-subtaskDurationInMinutes;
    document.querySelector('#unallocated h4').textContent = `unallocated minutes: ${newUnallocated}`;
    

}

function submitSub(event){

    event.preventDefault();

    if (!subtaskNameIsValid()){
        
        return;
    }
        
    if (!subtaskDurationIsValid()){
        
        return;
    } 

    updateUnallocated();
    
    renderSubTask();

}





const resetBtn = document.querySelector('.resetBtn');
resetBtn.addEventListener('click',reset); 

const submitMainBtn = document.querySelector('.submitMainBtn');
submitMainBtn.addEventListener('click',submitMain); 

const submitSubBtn = document.querySelector('.submitSubBtn');
submitSubBtn.addEventListener('click',submitSub);