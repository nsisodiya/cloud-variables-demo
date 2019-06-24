class MongoDbAdapter {
  constructor() {}
  act(reqObj) {
    return myfetch('/cloudvariables', reqObj);
  }
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
  console.log('Async Operation done');
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
    const response = await this.__adapter.act({
      action: 'createDocument',
      collectionName: this.__collectionName,
      data: data
    });
    //TODO - check response.success
    this.localCreate(response.document);
    return this;
  }
  localCreate(data) {
    /**
     *  var temperature = null;
        Object.defineProperty(this, 'temperature', {
          enumerable: false,
      configurable: false,
      writable: false,
          get() {
            return temperature;
          },
          set(value) {
            temperature = value;
          }
        });
    */
    var clonedData = JSON.parse(JSON.stringify(data));
    var self = this;
    Object.keys(data).map(function(key) {
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true,
        get() {
          console.log('getting value');
          return clonedData[key];
        },
        set(value) {
          console.log('setting value');
          clonedData[key] = value;
          // Now we need to sync
          return self.sync();
        }
      });
    });
  }
  async update(partialData) {
    console.log('Updating document, partial');
    const response = await this.__adapter.act({
      action: 'updateDocument',
      collectionName: this.__collectionName,
      data: Object.assign({ _id: this._id }, partialData)
    });
    return this;
  }
  async sync() {
    console.log('Syncing document. Sending Local changes to server');
    const response = await this.__adapter.act({
      action: 'updateDocument',
      collectionName: this.__collectionName,
      data: Object.assign(this)
    });
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
    const response = await this.__adapter.act({
      action: 'getAllDocuments',
      collectionName: this.__collectionName,
      data: {}
    });
    // TODO push all these variables into collection array one by one and don't created from server side.
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
  constructor({ adapterType, url, scope }) {
    if (adapterType === 'mongo') {
      this.__adapter = new MongoDbAdapter({ url, scope });
    }
    this.collections = [];
  }
  async Array(collectionName) {
    var c = new Collection({ __collectionName: collectionName, __adapter: this.__adapter });
    await c.sync();
    this.collections.push(c);
    return c;
  }
  async Object() {
    console.log('TODO');
  }
}
