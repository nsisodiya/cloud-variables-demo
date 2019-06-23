class MongoDbAdapter {
  constructor() {}
}

async function myfetch(url, d) {
  var rawResponse = await fetch('/cloudvariables', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  });
  return await rawResponse.json();
}

class Document {
  constructor({ __collectionName, __adapter }) {
    Object.defineProperty(this, '__collectionName', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: __collectionName
    });
    Object.defineProperty(this, '__adapter', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: __adapter
    });
  }
  async create(data) {
    console.log('Creating new document on server', data);
    // TODO this will go in adapter
    const response = await myfetch('/cloudvariables', {
      action: 'createDocument',
      collectionName: this.__collectionName,
      data: data
    });
    //TODO - check response.success
    this.localCreate(response.document);
    return this;
  }
  localCreate(data) {
    var self = this;
    Object.keys(data).map(function(key) {
      self[key] = data[key];
    });
  }
  async update(partialData) {
    const response = await myfetch('/cloudvariables', {
      action: 'updateDocument',
      collectionName: this.__collectionName,
      data: Object.assign({ _id: this._id }, partialData)
    });
    console.log('Updating document, partial');
  }
  async sync() {
    console.log('TODO - Syncing document');
    return this;
  }
}

class Collection extends Array {
  constructor({ __collectionName, __adapter }) {
    super(); //init emptry collection !!
    // TODO - it should now sync with server
    // being explicit
    Object.defineProperty(this, '__collectionName', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: __collectionName
    });
    Object.defineProperty(this, '__adapter', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: __adapter
    });
  }
  async push(data) {
    var d = new Document({ __collectionName: this.__collectionName, __adapter: this.__adapter });
    await d.create(data);
    this[this.length] = d;
    return d;
  }
  async sync() {
    console.log('Syncing all the collections data');
    const response = await myfetch('/cloudvariables', {
      action: 'getAllDocuments',
      collectionName: this.__collectionName,
      data: {}
    }); // TODO push all these variables into collection array one by one and don't created from server side.
    //TODO check response.success
    response.collection.forEach((doc) => {
      var d = new Document({ __collectionName: this.__collectionName, __adapter: this.__adapter });
      d.localCreate(doc);
      this[this.length] = d;
    });
    console.log('collectionData', response.collection);
    return this;
  }
}

class CloudVariables {
  constructor() {
    this.adapter = new MongoDbAdapter();
    this.collections = [];
  }
  Array(collectionName) {
    var self = this;
    return new Promise(async function(resolve, reject) {
      var c = new Collection({ __collectionName: collectionName, __adapter: self.adapter });
      await c.sync();
      self.collections.push(c);
      resolve(c);
    });
  }
}
