function render() {
  const app = document.getElementById("app");
  const todoListModel = new TodoListModel();
  const todoListView = new TodoListView();
  new TodoListController(todoListModel, todoListView);
  app.appendChild(todoListView.view);
}

render();
