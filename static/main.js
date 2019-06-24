async function main() {
  var cv = new CloudVariables({
    adapterType: 'mongo',
    url: '/cloudvariables', //TODO -  use this variabble
    scope: 'dTDdfrFDE$RFDcGTFERRFFde45tfGVC' //TODO - This is like userID
  });
  window.cv = cv;
  return;
  var customers = await cv.Array('customer'); //this execute sync function
  window.customers = customers;
  console.log('customers', customers);
  // customers is array of Objects
  // customers[0] === p1
  // Push is similar to Array, but this will insert data on Array

  // customers.sync();// this will sync and get fresh data.// TODO
  // p1.sync()// this will sync and get fresh data.//TODO

  var p1 = await customers.push({
    name: '$Narendra Sisodiya',
    mobile: '9891341086',
    email: 'narendra.sisodiya.1983@gmail.com',
    age: 36
  });
  var p2 = await customers.push({
    name: '$Chetan Sisodiya',
    mobile: '9584736543',
    email: 'chetan.sisodiya@gmail.com',
    age: 30
  });
  //p1.onChange ==> to subscribe change.
  //customers.onChange ==> to subscribe change.
  console.log('customers[0] === p1 MUST be true', customers[0] === p1);
  console.log('customers[0] === p1 MUST be true', customers[1] === p2);
  console.log('p1.name MUST be Narendra Sisodiya', p1.name === 'Narendra Sisodiya');
  // try {
  //   p1.age = 67; TODO
  // } catch (error) {
  //   console.log(error);
  //   console.log('This should throw error, because direct edit on such Object is not allowed');
  // }

  await p1.update({
    age: 50
  });
  console.log('p1', p1);
}
main();
