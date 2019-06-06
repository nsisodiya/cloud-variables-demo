# cloud-variables-demo

WIP

# Imagination on API.

```js
import CloudVariables from "cloud-variables";

// Initialise

var cv = new CloudVariables.init({
  driver: "MONGO",
  userId: "dTDdfrFDE$RFDcGTFERRFFde45tfGVC" //Per user we want to store
});

var todoList = await cv.initCollection("todoList");
// This will actually bind a todoList Collection from MongoDB
// If collection not found on backend, it will throw error.

var previousItem = await todoList.readItem("jiu936"); // This will load item from remote DB to this variable.
console.log("previousItem.task", previousItem.task);

var firstItem = await todoList.createItem({
  task: "Visit Tibbat",
  done: false,
  id: "hjs456"
});
// id must be generated from client side.
// todoList[hjs456] === firstItem
// This will create actual new document on the

todoList.map(function(v) {
  console.log("Listing all the items in the collections", v);
});

// Modify particular item.
var thirdItem = todoList["sxd309"];
await thirdItem.setItem({
  task: "Plant a tree"
});
// This should merge with exisiting keys.

///

var globalCollection = await cv.initCollection({
  collection: "global",
  syncAll: true // No need to perform readItem operation. All the items will be synced
});
var globalSettings = globalCollection["global"]; //Id is global
// Read
const currentLang = globalSettings.lang; //TODO - think, we need await here.
const currentTheme = globalSettings.theme;
// Modify
await globalSettings.setItem({
  lang: "en-IN"
});
await globalSettings.setItem({
  theme: "dark"
});
```

# TODO Think

- add server side validation will in server code.
