const inputText = document.querySelector('.input-text');
const addBtnInput = document.querySelector('.add-btn');
const taskList = document.querySelector('.task-list');
const checkItem = document.querySelectorAll('.check-item');
const countList = document.querySelector('.count-list');
const filterBtns = document.querySelectorAll('.filters-todo button');
const deleteListAll = document.querySelector('.delete-list');
const themeBtn = document.querySelector(".theme-toggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains('dark-theme')) {
        localStorage.getItem("theme", "dark");
    } else {
        localStorage.getItem("theme", "light");
    }
})

let tasks = [];

let currentFilter = 'All';

const updateCounter = () => {
    const notCheked = Array.from(document.querySelectorAll('.check-item'));

    const filteredList = notCheked.filter((item) => {
        return !item.classList.contains("checked");
    })

    countList.textContent = `${filteredList.length} items left`;
}

const applyFilter = (typeFilter) => {
    const taskItem = document.querySelectorAll('.task-item');

    taskItem.forEach(task => {
        const checkItem = task.querySelector('.check-item');
        const isChecked = checkItem.classList.contains('checked');

        if (typeFilter === "All") {
            task.style.display = "flex";
        } else if (typeFilter === "Active") {
            task.style.display = isChecked ? "none" : "flex";
        } else if (typeFilter === "Completed") {
            task.style.display = isChecked ? "flex" : "none";
        }
    });
}

const render = () => {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        taskList.innerHTML += `
            <div class="task-item" data-id="${task.id}">
                <span class="check-item ${task.completed ? "checked" : ""}"></span>
                <p class="text-item">${task.text}</p>
                <button class="delete-item">–</button>
            </div>
        `;
    })

    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateCounter()
    applyFilter(currentFilter)
}

addBtnInput.addEventListener('click', () => {
    const currentInputText = inputText.value.trim();

    if (currentInputText.length === 0) {
        alert("Please enter a task")
    } else {
        const newTask = { id: Date.now(), text: currentInputText, completed: false };
        tasks.push(newTask);
        render()
        inputText.value = "";
    }
})

inputText.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addBtnInput.click();
    }
});

taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('check-item')) {
        const currenttaskItem = event.target.closest('.task-item');
        const currentId = currenttaskItem.dataset.id;

        const task = tasks.find(t => t.id == currentId);
        if (task) task.completed = !task.completed;
        render()
    }

    if (event.target.classList.contains('delete-item')) {
        const currenttaskItem = event.target.closest('.task-item');
        currenttaskItem.classList.add("fade-out");
        const currentId = currenttaskItem.dataset.id;

        currenttaskItem.addEventListener("transitionend", () => {
            currenttaskItem.remove();

            const index = tasks.findIndex(t => t.id == currentId);
            if (index !== -1) tasks.splice(index, 1);

            updateCounter();
            applyFilter(currentFilter);
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }, { once: true });
    }

    const selecttaskItem = event.target.closest('.task-item');
    if (!selecttaskItem) return;

    if (event.target.closest('.check-item') || event.target.closest('.delete-item')) {
        return
    }

    document.querySelectorAll(".task-item").forEach(item => {
        item.classList.remove("selected");
    });
    selecttaskItem.classList.add("selected")
})

const savedTask = localStorage.getItem('tasks');

if (savedTask) {
    tasks = JSON.parse(savedTask);
}

render()

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {

        filterBtns.forEach(b => b.classList.remove("active-filter"));
        btn.classList.add("active-filter");

        currentFilter = btn.textContent;
        applyFilter(currentFilter)
    })
})

deleteListAll.addEventListener('click', () => {
    tasks = [];
    render()
})

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
}