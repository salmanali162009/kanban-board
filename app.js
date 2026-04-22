let div = document.querySelectorAll('.tasksection');
let displayAddTask = document.querySelector('.addTaskDisplay');
let form = document.querySelector('form');
let nameInput = document.querySelector('input');
let discription = document.querySelector('textarea');

let todo = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

div.forEach((section, index) => {
    section.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    section.addEventListener('dragenter', () => {
        section.parentElement.classList.add('dotted');
    });

    section.addEventListener('dragleave', () => {
        section.parentElement.classList.remove('dotted');
    });

    section.addEventListener('drop', () => {
        let draggingElement = document.querySelector('.opacity');
        section.parentElement.classList.remove('dotted');
        
        if (draggingElement) {
            section.append(draggingElement);
            const taskId = draggingElement.getAttribute('data-id');
            todo[taskId].status = index; 
            saveAndRender();
        }
    });
});

document.querySelector('.addTaskBtn').addEventListener('click', () => {
    displayAddTask.classList.toggle('hide');
});

document.querySelector('.back').addEventListener('click', () => {
    displayAddTask.classList.add('hide');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    todo.push({
        name: nameInput.value,
        discription: discription.value,
        status: 0 
    });
    nameInput.value = '';
    discription.value = '';
    displayAddTask.classList.add('hide');
    saveAndRender();
});

function saveAndRender() {
    localStorage.setItem('kanbanTasks', JSON.stringify(todo));
    showCard();
}

function showCard() {
    div.forEach(s => s.innerHTML = '');
    
    let counts = [0, 0, 0];

    todo.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.draggable = true;
        taskDiv.setAttribute('data-id', index);
        
        taskDiv.innerHTML = `
            <h3 class="name">${task.name}</h3>
            <div class="description">${task.discription}</div>
            <button class="delete" onclick="deleteTask(${index})">delete</button>
        `;

        taskDiv.addEventListener('dragstart', () => {
            taskDiv.classList.add('opacity');
        });

        taskDiv.addEventListener('dragend', () => {
            taskDiv.classList.remove('opacity');
        });

        div[task.status].appendChild(taskDiv);
        counts[task.status]++;
    });

    document.querySelectorAll('.count').forEach((span, i) => {
        span.innerText = counts[i];
    });
}

function deleteTask(index) {
    todo.splice(index, 1);
    saveAndRender();
}

showCard();