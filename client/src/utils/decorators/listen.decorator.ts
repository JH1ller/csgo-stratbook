import { createDecorator } from 'vue-class-component';

interface ListenOptions {
  window: boolean;
}

// TODO: hooks are triggered twice for some reason
export function Listen(event: keyof DocumentEventMap, options?: ListenOptions) {
  return createDecorator((component, key) => {
    const handler = component.methods![key];

    const createdHook = component.created;
    const beforeDestroyHook = component.beforeDestroy;

    let boundHandler: (...args: any[]) => any;

    const target = options?.window ? window : document;

    component.created = function() {
      createdHook?.call(this);
      boundHandler = handler.bind(this as Vue);
      target.addEventListener(event, boundHandler);
    };

    component.beforeDestroy = function() {
      beforeDestroyHook?.call(this);
      target.removeEventListener(event, boundHandler);
    };
  });
}
