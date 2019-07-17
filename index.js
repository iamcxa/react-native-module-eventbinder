import {
  NativeEventEmitter,
  DeviceEventEmitter,
  Platform
} from 'react-native';

const binder = (module) => {
  // ios/android 有不同的 EventEmitter
  const EventEmitter = Platform.select({
    ios: () => new NativeEventEmitter(module),
    android: () => DeviceEventEmitter,
  })();

  console.log('module=>', module);

  if (!module) {
    console.error('module is null.');
    throw new Error('NativeModule "module" is not link yet.');
  }

  // 定義 Event Listener function，可以在 RN 專案內使用
  module.on = (event, callback) => {
    const nativeEvent = module.getConstants()[event]
      || (module.EVENT ? module.EVENT[event] : null);
    console.log('module.getConstants()=>', module.getConstants());
    console.log('module.EVENT=>', module.EVENT);
    if (!nativeEvent) {
      throw new Error(`@EventBinder: Invalid event: "${event}"`);
    }
    EventEmitter.removeAllListeners(nativeEvent);
    return EventEmitter.addListener(nativeEvent, callback);
  };

  module.onOnce = (event, callback) => {
    const nativeEvent = module.getConstants()[event]
      || (module.EVENT ? module.EVENT[event] : null);
    if (!nativeEvent) {
      throw new Error(`@EventBinder: Invalid event: "${event}"`);
    }
    EventEmitter.removeAllListeners(nativeEvent);
    return EventEmitter.once(nativeEvent, callback);
  };

  module.emit = (event) => {
    console.log('emit=>', event);
    return EventEmitter.emit(event);
  };

  module.removeAllListeners = () => {
    console.log('EventEmitter=>', EventEmitter);
    return EventEmitter.removeAllListeners();
  };

  module.removeOneListeners = (event) => {
    console.log('removeOneListeners=>', event);
    console.log('EventEmitter=>', EventEmitter);
    return EventEmitter.removeAllListeners(event);
  };

  return module;
}

export default binder;
