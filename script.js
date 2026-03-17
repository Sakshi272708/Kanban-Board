function saveboard() {
    console.log("is running")
    let data = {
        todo: [],
        progress: [],
        done: [],
    };
    document.querySelectorAll("#todo .task-list .task span").forEach(task => {
        data.todo.push({
            text: task.innerText,
            completed: task.closest(".task").classList.contains("completed")
        });
    });
    document.querySelectorAll("#progress .task-list .task span").forEach(task => {
        data.progress.push({
            text: task.innerText,
            completed: task.closest(".task").classList.contains("completed")
        });
    });
    document.querySelectorAll("#done .task-list .task span").forEach(task => {
        data.done.push({
            text: task.innerText,
            completed: task.closest(".task").classList.contains("completed")
        });
    });

    localStorage.setItem("KanbanData", JSON.stringify(data))
}

let container = document.getElementById("container");

container.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-task")) {
        let column = e.target.closest(".column");
        // to find tasklist area from whole column
        let tasklist = column.querySelector(".task-list");
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter task...";
        input.classList.add("task-input");

        tasklist.appendChild(input);
        input.focus();
        // used becoz it could not replace the old task 
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                let taskText = input.value.trim();
                if (!taskText) return;

                createTask(`#${column.id} .task-list`, taskText, false);
                input.remove();
                saveboard();
            }
        });
    };

    // to dlt a task
    if (e.target.classList.contains("dlt-btn")) {
        e.target.closest(".task").remove();
        saveboard();
    }
});

// to mark a task completed
container.addEventListener("dblclick", function (e) {

    if (e.target.classList.contains("dlt-btn")) return;
    if (e.target.closest(".dlt-btn")) return;
    let selected = e.target.closest(".task");
    if (selected) {
        selected.classList.toggle("completed")
        saveboard();
    };
});
// to clear complete task
function clearCompleted() {
    document.querySelectorAll(".completed").forEach(task => {
        task.remove();
    });

    saveboard();
}

// to edit a task
container.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    let task = e.target.closest(".task");
    if (!task) return;

    let span = task.querySelector("span");
    let newText = prompt("Edit task:", span.innerText);

    if (newText) {
        span.innerText = newText;
        saveboard();
    }
});
let dragged = null;
container.addEventListener("dragstart", function (e) {
    let dragtask = e.target.closest(".task");
    if (dragtask) {
        dragged = dragtask;
         dragtask.classList.add("dragging");
    }
});

container.addEventListener("dragover", function (e) {
    e.preventDefault();
});

container.addEventListener("drop", function (e) {
    let selectedcol = e.target.closest(".column");
    if (selectedcol) {
        let tasklist = selectedcol.querySelector(".task-list");
        tasklist.appendChild(dragged);
        dragged.classList.remove("dragging");        // remove effect
        dragged = null
        saveboard();
    }
});

function loadBoard() {
    let saved = localStorage.getItem("KanbanData");
    if (!saved) return;
    // convert data in object again
    let data = JSON.parse(saved);
    // remove completed tasks
    data.todo = data.todo.filter(task => !task.completed);
    data.progress = data.progress.filter(task => !task.completed);
    data.done = data.done.filter(task => !task.completed);
    // save cleaned data
    localStorage.setItem("KanbanData", JSON.stringify(data));
    // rebuild board so that task reapper after refresh 
    data.todo.forEach(task => {
        createTask("#todo .task-list", task.text, false);
    });

    data.progress.forEach(task => {
        createTask("#progress .task-list", task.text, false);
    });

    data.done.forEach(task => {
        createTask("#done .task-list", task.text, false);
    });

}
document.addEventListener("DOMContentLoaded", loadBoard);
function createTask(columnSelector, text, completed) {
    let task = document.createElement("div");
    task.classList.add("task");
    task.draggable = true;

    if (completed) {
        task.classList.add("completed");
    }
    let span = document.createElement("span");
    span.innerText = text;

    let dltbtn = document.createElement("button");
    dltbtn.classList.add("dlt-btn");
    dltbtn.innerText = "❌";

    task.append(span);
    task.append(dltbtn);

    document.querySelector(columnSelector).appendChild(task);
}

let darkBtn = document.getElementById("darkmode");
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    darkBtn.textContent = "☀️";
  } else {
    darkBtn.textContent = "🌙";
  }
});