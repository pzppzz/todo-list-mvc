class TodoListModel {
  signals = {
    changed: new Dispose.Signal(),
  };

  constructor() {
    this.todoList = [];
  }

  #commit() {
    this.signals.changed.trigger(this.getTodoList());
  }

  #findTodoById(id) {
    return this.todoList.find((todo) => todo.id === id);
  }

  #findTodoByName(name) {
    return this.todoList.find((todo) => todo.name === name);
  }

  addTodo(todo) {
    if (this.#findTodoByName(todo.name)) {
      return;
    }
    this.todoList.push(todo);
    this.#commit();
  }

  deleteTodo(id) {
    if (!this.#findTodoById(id)) {
      return;
    }
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
    this.#commit();
  }

  toggleTodo(id) {
    if (!this.#findTodoById(id)) {
      return;
    }
    this.todoList = this.todoList.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    this.#commit();
  }

  toggleAll(done) {
    this.todoList = this.todoList.map((todo) => {
      todo.completed = done;
      return todo;
    });
    this.#commit();
  }

  deleteAllCompleted() {
    this.todoList = this.todoList.filter((todo) => !todo.completed);
    this.#commit();
  }

  clearAll() {
    this.todoList = [];
    this.#commit();
  }

  setTodoList(todoList) {
    this.todoList = todoList;
    this.#commit();
  }

  getTodoList() {
    return JSON.parse(JSON.stringify(this.todoList));
  }
}
