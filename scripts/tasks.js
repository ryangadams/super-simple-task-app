const apiEndpoint = '/tasks';
async function fetchTasks() {
    const request = await fetch(apiEndpoint)
    return request.json();
}

async function createTask(taskTitle) {
    const data = {
        id: self.crypto.randomUUID(),
        title: taskTitle
    }
    await fetch(apiEndpoint, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

async function markDone({id, _, done}) {
    const data = {
        done: !done
    }
    await fetch(`${apiEndpoint}/${id}`, {
        method: 'PATCH', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

async function deleteTask(taskId) {
    await fetch(`${apiEndpoint}/${taskId}`, {
        method: 'DELETE'
    });
}

function buildTaskItems(tasks) {
    return tasks.map(task => {
        const taskItem = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = task.title;
        if (task.done) {
            taskItem.classList.add('complete');
        }
        taskText.addEventListener('click', async () => {
            await markDone(task);
            await loadTasks();
        });
        taskItem.append(taskText);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await deleteTask(task.id);
            await loadTasks();
        })
        taskItem.append(deleteButton);
        return taskItem;
    });
}

async function loadTasks() {
    const tasks = await fetchTasks();
    const taskContainer = document.querySelector('#tasks ul');
    while(taskContainer.hasChildNodes()) {
        taskContainer.removeChild(taskContainer.firstChild);
    }
    taskContainer.append(...(buildTaskItems(tasks)));
}

async function newTaskEvent(e) {
    e.preventDefault();
    const taskTitle = document.getElementById('new-task-title').value;
    await createTask(taskTitle);
    await loadTasks();
}

function taskForm() {
    const form = document.createElement("form");
    form.innerHTML = `<p>
        <input type='text' placeholder='Task…' name='new-task-title' id='new-task-title'>
        <button id='add-task'>Add</button>
    </p>`;
    form.querySelector('#add-task').addEventListener('click', newTaskEvent);
    return form;
}
const $ = document.getElementById;

export async function initTasksApp() {
    let taskContainer = document.querySelector('#tasks ul');
    if (!taskContainer) {
        taskContainer = document.createElement('ul');
        $('tasks').appendChild(taskContainer);
    }
    await loadTasks();
    taskContainer.parentNode.insertBefore(taskForm(), taskContainer);
}

window.addEventListener('load', initTasksApp);
