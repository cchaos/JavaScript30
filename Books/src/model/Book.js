function Book( slots ) {
  this.isbn  = slots.isbn;
  this.title = slots.title;
  this.year  = slots.year;
};

//
// A class-level property Book.instances representing the collection of all Book instances managed by the application in the form of a map.
Book.instances = {};

//
// A static class-level method Book.convertRow2Obj for converting a row into a corresponding object of type Book.
Book.convertRow2Obj = function (bookRow) {
  var book = new Book( bookRow);
  return book;
};

//
// A class-level method Book.loadAll for loading all managed Book instances from the persistent data store.
Book.loadAll = function () {
  var i=0, key="", keys=[], bookTableString="", bookTable={};
  try {
    if (localStorage["bookTable"]) {
      bookTableString = localStorage["bookTable"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (bookTableString) {
    bookTable = JSON.parse( bookTableString);
    keys = Object.keys( bookTable);
    console.log( keys.length +" books loaded.");
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      Book.instances[key] = Book.convertRow2Obj( bookTable[key]);
    }
  }
};

//
// A class-level method Book.saveAll for saving all managed Book instances to the persistent data store.
Book.saveAll = function () {
  var bookTableString="", error=false,
      nmrOfBooks = Object.keys( Book.instances).length;
  try {
    bookTableString = JSON.stringify( Book.instances);
    localStorage["bookTable"] = bookTableString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( nmrOfBooks + " books saved.");
};

//
// A class-level method Book.add for creating and storing a new Book record.
Book.add = function (slots) {
  var book = new Book( slots);
  Book.instances[slots.isbn] = book;
  console.log("Book " + slots.isbn + " created!");
};

//
// A class-level method Book.update for updating an existing Book record.
Book.update = function (slots) {
  var book = Book.instances[slots.isbn];
  var year = parseInt( slots.year);
  if (book.title !== slots.title) { book.title = slots.title;}
  if (book.year !== year) { book.year = year;}
  console.log("Book " + slots.isbn + " modified!");
};

//
// A class-level method Book.destroy for deleting a Book instance.
Book.destroy = function (isbn) {
  if (Book.instances[isbn]) {
    console.log("Book " + isbn + " deleted");
    delete Book.instances[isbn];
  } else {
    console.log("There is no book with ISBN " + isbn + " in the database!");
  }
};

//
// A class-level method Book.createTestData for creating a few example book records to be used as test data.
Book.createTestData = function () {
  Book.instances["006251587X"] = new Book({isbn:"006251587X", title:"Weaving the Web", year:2000});
  Book.instances["0465026567"] = new Book({isbn:"0465026567", title:"Gödel, Escher, Bach", year:1999});
  Book.instances["0465030793"] = new Book({isbn:"0465030793", title:"I Am A Strange Loop", year:2008});
  Book.saveAll();
};

//
// A class-level method Book.clearData for clearing the book datastore.
Book.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    localStorage["bookTable"] = "{}";
  }
};