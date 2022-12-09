// oops based javascript

// Book Class: Represents a book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        // BOOKS ARE IN LOCAL STORAGE
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        
        const row = document.createElement('tr'); // created new row

        row.innerHTML = `         
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;   // adding some tags and data  inside row (<tr>) 

        list.appendChild(row) // appending row to table in document through queryselector and appendChild
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove(); 
            // anchor tag parent is td, td parent is tr so remove tr element parent of that element
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('#container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 2sec
        setTimeout(()=>{document.querySelector('.alert').remove()}, 2000);
    }
    
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}

// Store Class: Handles Storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            // convert the string data from loacl storage to json object 
            books = JSON.parse(localStorage.getItem('books')); 
        }

        return books;

    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book); // push method is used to push element into an array at the end

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Events: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Events: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    // prevent actual Submit Action
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value; // gets value inside input field
    // console.log(title); 
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author==='' || isbn === ''){
        // alert("Please enter a value");
        UI.showAlert("Please Fill In All Fields", 'danger');
    }
    else{
        // Initiate book
        const book = new Book(title, author, isbn);
        // console.log(book);

        // Add Book To UI
        UI.addBookToList(book);

        // Add book to Store(local storage)
        Store.addBook(book);

        // Show Success Message
        UI.showAlert("Book Added Successfully", 'success');

        // Clear Fields
        UI.clearFields();
    }   
})

// Events: Reamove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    // Show Success message
    UI.showAlert('Book Removed', 'success');
})