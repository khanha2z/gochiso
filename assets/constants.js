const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: "cart-update",
  quantityUpdate: "quantity-update",
  variantChange: "variant-change",
  cartError: "cart-error",
};

let subscribers = {};
function subscribe(eventName, callback) {
  return (
    subscribers[eventName] === void 0 && (subscribers[eventName] = []),
    (subscribers[eventName] = [...subscribers[eventName], callback]),
    function () {
      subscribers[eventName] = subscribers[eventName].filter(
        (cb) => cb !== callback
      );
    }
  );
}
function publish(eventName, data) {
  subscribers[eventName] &&
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
}
//# sourceMappingURL=/cdn/shop/t/2/assets/pubsub.js.map?v=2921868252632587581712898190
