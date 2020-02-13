const Callbacks = {};

const Events = {
  on: (at, id, callback) =>
    // console.log("at, id, callback -->>",at, id, callback)
    Events.listen(at, id, callback),
  listen: (at, id, callback) => {
    if (at === '') {
      return false;
    }
    if (at in Callbacks) {
      Callbacks[at][id] = callback;
    } else {
      Callbacks[at] = {};
      Callbacks[at][id] = callback;
    }
    return id;
  },
  t: (at, data) => Events.trigger(at, data),
  trigger: (at, data) => {
    data = data || '';
    const obj = Callbacks[at]; // eslint-disable-line
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop](data);
      }
    } // eslint-disable-line
  },
  rm: (at, id) => Events.remove(at, id),
  remove: (at, id) => {
    delete Callbacks[at][id];
  },
  removeAll: at => {
    delete Callbacks[at];
  },
};

module.exports = Events;
