# cloud-variables-demo
Work in Progress ! Most simple but unsecured way to bypass REST API and sync client side variables in MongoDB.

# Imagination on API.

```js
import CloudVariables from "cloud-variables";

// Initialise

var cv = new CloudVariables({
  driver: "MONGO",
  userId: "dTDdfrFDE$RFDcGTFERRFFde45tfGVC" //Per user we want to store
});

var todoList = await cv.Array("todo");
// This will actually bind a todoList Collection from MongoDB
// If collection not found on backend, it will throw error.

//var previousItem = await todoList.getById("jiu936"); // This will load item from remote DB to this variable.
console.log('Print Length', todoList.length);

var firstItem = await todoList.push({
  task: "Visit Tibbat",
  done: false
});
console.log('this is true', firstItem.task === "Visit Tibbat");

var secItem = await todoList.push({
  task: "Write Book",
  done: false
});
todoList.map(function(v) {
  console.log("Listing all the items in the collections", v);
});

// Modify particular item.
var thirdItem = todoList[2];
await thirdItem.update({
  task: "Plant a tree"
});
// This should merge with exisiting keys.

///

var globalSettings = await cv.Object("settings");

await globalSettings.update({
  lang: "hi",
  theme: "dark"
})
console.log("must be true", globalSettings.lang === 'hi');
console.log("must be true", globalSettings.theme === 'dark');


var myPersonalData = await cv.Object("myPersonalData");

await myPersonalData.update({
  email: "narendra.sisodiya.1983@gmail.com",
  coder: true
});

```

# TODO Think

- add server side validation will in server code.
