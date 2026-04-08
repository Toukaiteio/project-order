export function defineStore(id, options) {
  return () => {
    const store = {
      $id: id,
      ...options.state(),
    };
    for (const actionName in options.actions) {
      store[actionName] = options.actions[actionName].bind(store);
    }
    return store;
  };
}
