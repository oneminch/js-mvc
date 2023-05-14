class Model {
  constructor() {
    this.books = [
      {
        id: "recursion-1",
        bookName: "Recursion",
        read: true
      },
      {
        id: "dark-matter-2",
        bookName: "Dark Matter",
        read: true
      },
      {
        id: "midnight-library-3",
        bookName: "The Midnight Library",
        read: false
      }
    ];
  }

  createBook(bookName) {
    const generatedId =
      bookName.trim().toLowerCase().split(" ").join("-") +
      "-" +
      (Math.random() * 50).toFixed();

    const book = {
      id: generatedId,
      bookName: bookName,
      read: false
    };

    this.books.push(book);

    this.onBookListChanged(this.books);
  }

  deleteBook(id) {
    const rmIndex = this.books.findIndex((book) => book.id === id);
    this.books.splice(rmIndex, 1);

    this.onBookListChanged(this.books);
  }

  toggleBook(id) {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    this.books[bookIndex].read = !this.books[bookIndex].read;

    this.onBookListChanged(this.books);
  }

  bindBookListChangeEvent(callback) {
    this.onBookListChanged = callback; //
  }
}

class View {
  constructor() {
    this.app = this.getElement("#app");

    this.heading = this.createElement("h1");
    this.heading.textContent = "Booklist (MVC)";

    this.form = this.createElement("form");

    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.name = "book";
    this.input.placeholder = "Enter book";

    this.button = this.createElement("button");
    this.button.type = "submit";
    this.button.textContent = "Add";

    this.list = this.createElement("ul");
    // this.

    this.form.append(this.input, this.button);
    this.app.append(this.heading, this.form, this.list);
  }

  get #bookEntry() {
    return this.input.value;
  }

  #resetInput() {
    this.input.value = "";
  }

  createElement(tag, className) {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    return el;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  populateBooks(books) {
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }

    if (books.length == 0) {
      const emptyMsg = this.createElement("p");
      emptyMsg.textContent = "Your list is empty!";
      this.list.append(emptyMsg);
      return;
    }

    books.forEach((book) => {
      const bookItem = this.createElement("li");
      bookItem.dataset.id = book.id;

      const checkbox = this.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = book.read;

      const bookText = this.createElement("span");

      if (book.read) {
        const finishedBook = this.createElement("s");
        finishedBook.textContent = book.bookName;
        bookText.append(finishedBook);
      } else {
        bookText.textContent = book.bookName;
      }

      const deleteBtn = this.createElement("button");
      deleteBtn.textContent = "X";

      bookItem.append(checkbox, bookText, deleteBtn);
      this.list.append(bookItem);
    });
  }

  bindCreateBookEvent(eventHandler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.#bookEntry) {
        eventHandler(this.#bookEntry);
        this.#resetInput();
      }
    });
  }

  bindDeleteBookEvent(eventHandler) {
    this.list.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() == "button") {
        const bookElement = e.target.parentElement;
        const bookId = bookElement.dataset.id;
        eventHandler(bookId);
      }
    });
  }

  bindToggleBookEvent(eventHandler) {
    this.list.addEventListener("change", (e) => {
      const bookElement = e.target.parentElement;
      const bookId = bookElement.dataset.id;
      eventHandler(bookId);
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCreateBookEvent(this.handleCreateBookEvent);
    this.view.bindToggleBookEvent(this.handleToggleBookEvent);
    this.view.bindDeleteBookEvent(this.handleDeleteBookEvent);

    this.model.bindBookListChangeEvent(this.onBookListChanged);

    this.onBookListChanged(this.model.books);
  }

  onBookListChanged = (books) => {
    this.view.populateBooks(books);
  };

  handleCreateBookEvent = (bookName) => {
    this.model.createBook(bookName);
  };

  handleDeleteBookEvent = (id) => {
    this.model.deleteBook(id);
  };

  handleToggleBookEvent = (id) => {
    this.model.toggleBook(id);
  };
}

const app = new Controller(new Model(), new View());
