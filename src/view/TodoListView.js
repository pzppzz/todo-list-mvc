class TodoInput {
  constructor(todoListView) {
    this.todoListView = todoListView;
    this.view = document.createElement("div");
    this.view.classList.add("todo-list-header");

    this.input = document.createElement("input");
    this.input.placeholder = "Press enter to submit";
    this.input.classList.add("todo-list-header-input", "layui-input");

    this.submitButton = document.createElement("button");
    this.submitButton.classList.add("layui-btn");
    this.submitButton.appendChild(document.createTextNode("SUBMIT"));

    this.view.appendChild(this.input);
    this.view.appendChild(this.submitButton);

    this.#bindEvents();
  }

  #bindEvents() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.#addTodo(e.target.value);
      }
    });
    this.submitButton.addEventListener("click", (e) => {
      this.#addTodo(e.target.value);
    });
  }

  #addTodo(name) {
    if (name) {
      this.todoListView.signals.addTodo.trigger(name);
      this.input.value = "";
    }
  }
}

class TodoView {
  constructor(todo, todoListView, order) {
    this.todo = todo;
    this.todoListView = todoListView;

    this.view = document.createElement("div");
    this.view.classList.add("todo-list-item");
    if (this.todo.completed) {
      this.view.classList.add("todo-list-item-completed");
    }

    this.checkbox = document.createElement("input");
    this.checkbox.classList.add("todo-list-item-checkbox");
    this.checkbox.type = "checkbox";
    this.checkbox.checked = todo.completed;

    this.label = document.createElement("span");
    this.label.classList.add("todo-list-item-label");
    this.label.appendChild(document.createTextNode(order + ". " + todo.name));

    this.deleteButton = document.createElement("button");
    this.deleteButton.classList.add(
      "todo-list-item-delete",
      "layui-btn",
      "layui-btn-sm",
      "layui-btn-danger"
    );
    this.deleteButton.appendChild(document.createTextNode("DELETE"));

    this.view.appendChild(this.checkbox);
    this.view.appendChild(this.label);
    this.view.appendChild(this.deleteButton);

    this.#bindEvents();
  }

  #bindEvents() {
    this.checkbox.addEventListener("change", () => {
      this.todoListView.signals.toggleTodo.trigger(this.todo.id);
    });
    this.deleteButton.addEventListener("click", (e) => {
      this.todoListView.signals.deleteTodo.trigger(this.todo.id);
    });
  }
}

class TodoListFooter {
  constructor(todoListView) {
    this.todoListView = todoListView;
    this.view = document.createElement("div");
    this.view.classList.add("todo-list-footer");

    this.leftArea = document.createElement("div");
    this.leftArea.classList.add("todo-list-footer-left");
    this.rightArea = document.createElement("div");

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.todoListInfo = document.createElement("span");

    this.leftArea.appendChild(this.checkbox);
    this.leftArea.appendChild(this.todoListInfo);

    this.clearAllButton = document.createElement("button");
    this.clearAllButton.classList.add(
      "layui-btn",
      "layui-btn-sm",
      "layui-btn-danger"
    );
    this.clearAllButton.appendChild(document.createTextNode("Clear All"));

    this.deleteAllCompletedButton = document.createElement("button");
    this.deleteAllCompletedButton.classList.add("layui-btn", "layui-btn-sm");
    this.deleteAllCompletedButton.appendChild(
      document.createTextNode("Delete All Completed")
    );

    this.rightArea.appendChild(this.clearAllButton);
    this.rightArea.appendChild(this.deleteAllCompletedButton);

    this.view.appendChild(this.leftArea);
    this.view.appendChild(this.rightArea);

    this.#bindEvents();
  }

  #bindEvents() {
    this.clearAllButton.addEventListener("click", () => {
      this.todoListView.signals.clearAll.trigger();
    });
    this.deleteAllCompletedButton.addEventListener("click", () => {
      this.todoListView.signals.deleteAllCompleted.trigger();
    });
    this.checkbox.addEventListener("change", () => {
      this.todoListView.signals.toggleAll.trigger(this.checkbox.checked);
    });
  }

  #getDoneCount(todos) {
    return todos.filter((todo) => todo.completed).length;
  }

  refresh(todos) {
    const doneCount = this.#getDoneCount(todos);
    const totalCount = todos.length;
    this.todoListInfo.innerText = `${doneCount} / ${totalCount}`;

    if (doneCount === 0) {
      this.deleteAllCompletedButton.classList.add("layui-btn-disabled");
    } else {
      this.deleteAllCompletedButton.classList.remove("layui-btn-disabled");
    }

    if (totalCount === 0) {
      this.clearAllButton.classList.add("layui-btn-disabled");
    } else {
      this.clearAllButton.classList.remove("layui-btn-disabled");
    }

    this.checkbox.checked = doneCount === totalCount;
  }
}

class TodoListView {
  signals = {
    addTodo: new Dispose.Signal(),
    deleteTodo: new Dispose.Signal(),
    toggleTodo: new Dispose.Signal(),
    toggleAll: new Dispose.Signal(),
    clearAll: new Dispose.Signal(),
    deleteAllCompleted: new Dispose.Signal(),
  };

  constructor() {
    this.view = document.createElement("div");
    this.view.classList.add("todo-list-view");

    this.inputView = new TodoInput(this);
    this.todoListView = document.createElement("div");
    this.todoListView.classList.add("todo-list");
    this.todoListFooter = new TodoListFooter(this);

    this.view.appendChild(this.inputView.view);
    this.view.appendChild(this.todoListView);
    this.view.appendChild(this.todoListFooter.view);
  }

  renderTodoList(todos) {
    this.todoListView.innerHTML = "";
    const fragment = document.createDocumentFragment();
    todos.forEach((todo, index) => {
      const todoView = new TodoView(todo, this, index + 1);
      fragment.appendChild(todoView.view);
    });
    this.todoListView.appendChild(fragment);
    this.todoListFooter.refresh(todos);
  }
}
