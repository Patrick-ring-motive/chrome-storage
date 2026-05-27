	
	const isString = x => typeof x === 'string' || x instanceof String;

const stringify = x =>{
	try{
		if(isString(x)){
			return String(x);
		}
		return String(JSON.stringify(x));
	}catch{
		return String(x);
	}
};

const isNullish = x => x === undefined || x === null;

const Obj = x => isNullish(x) ? Object.create(null) : Object(x);

const parse = x =>{
	try{
		return JSON.parse(x);
	}catch{
		return Obj(x);
	}
};

  const chromeStorage = {
  async get(key) {
	  try{
    return (await chrome.storage.sync.get([key]))?.[key];
	  }catch(e){
		  console.warn(e,key);
	  }
  },
  async set(key, value) {
	  try{
      const obj = {};
    obj[key] = value;
      return await chrome.storage.sync.set(obj);
	  }catch(e){
		  console.warn(e,key,value);
	  }
  },
  async delete(key) {
	  try{
    return await chrome.storage.sync.remove(key);
	  }catch(e){
		  console.warn(e,key);
	  }
  }
};

const chromeStore = {
  async get(key) {
    try {
      key = await key;
      const rawValue = await chromeStorage.get(key);
      return parse(rawValue);
    } catch (e) {
      console.warn(e, key);
    }
  },
  async set(key, value) {
    try {
      [key, value] = await Promise.all([key, value]);
      return await chromeStorage.set(key, stringify(value));
    } catch (e) {
      console.warn(e, key, value);
    }
  },
  async delete(key) {
    try {
      return await chromeStorage.delete(key);
    } catch (e) {
      console.warn(e, key);
    }
  }
};
