import "reflect-metadata";

export function attribute() {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target.constructor.prototype, propertyKey, {
      configurable: true,
      enumerable: true
    });
    target.constructor.fields = {
      ...(target.constructor.fields || {}),
      ...{ [propertyKey]: attr() }
    };
  };
}

export class Model {
  constructor(...args:any[]){
  }
}

function attr() {
  return {};
}

export function id() {

  return function(target: any, propertyKey: string) {
    Object.defineProperty(target.constructor.prototype, propertyKey, {
      configurable: true,
      enumerable: true
    })
    target.constructor.idAttribute = propertyKey;
    target.constructor.fields = {
      ...(target.constructor.fields || {}),
      ...{ [propertyKey]: attr() }
    };
  };
}

export type Constructor<T = {}> = new(...args:any[]) => T | { new (...args: any[]): T } ;

class QuerySet<T> {
  all(): QuerySet<T> {
    return this;
  }
}

export function Entity(modelName: string) {
  return function<
    T extends Constructor & { fields?: any; idAttribute?: string }
  >(target: T): T  {
    class ModelClass extends Model {
      static modelName = modelName;
      static fields = target.fields || {};
      static idAttribute = target.idAttribute || "id";
    }

    Object.getOwnPropertyNames(target.prototype).forEach(name => {
      Object.defineProperty(
        ModelClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(target.prototype, name) || {
          enumerable: true
        }
      );
    });

    return ModelClass as any
  };
}
