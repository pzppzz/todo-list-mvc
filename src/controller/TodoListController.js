function createId() {
  return Math.random().toString(36).substring(2, 9);
}

class TodoListController {
  constructor(todoListModel, todoListView) {
    this.todoListModel = todoListModel;
    this.todoListView = todoListView;
    this.#bindEvents();
    const todos = window.localStorage.getItem("todos");
    if (todos) {
      this.todoListModel.setTodoList(JSON.parse(todos));
    }
  }

  #bindEvents = () => {
    this.todoListModel.signals.changed.connect(this.#onTodoListChanged);
    this.todoListView.signals.addTodo.connect(this.handleAddTodo);
    this.todoListView.signals.deleteTodo.connect(this.handleDeleteTodo);
    this.todoListView.signals.toggleTodo.connect(this.handleToggleTodo);
    this.todoListView.signals.toggleAll.connect(this.handleToggleAll);
    this.todoListView.signals.clearAll.connect(this.handleClearAll);
    this.todoListView.signals.deleteAllCompleted.connect(
      this.handleDeleteAllCompleted
    );
  };

  #onTodoListChanged = (todos) => {
    this.todoListView.renderTodoList(todos);
    window.localStorage.setItem("todos", JSON.stringify(todos));
  };

  handleAddTodo = (name) => {
    const todo = {
      id: createId(),
      name,
      completed: false,
    };
    this.todoListModel.addTodo(todo);
  };

  handleDeleteTodo = (id) => {
    this.todoListModel.deleteTodo(id);
  };

  handleToggleTodo = (id) => {
    this.todoListModel.toggleTodo(id);
  };

  handleToggleAll = (done) => {
    this.todoListModel.toggleAll(done);
  };

  handleDeleteAllCompleted = () => {
    this.todoListModel.deleteAllCompleted();
  };

  handleClearAll = () => {
    this.todoListModel.clearAll();
  };
}
