import { Class } from 'utility-types';
import { Entity } from './entity';
export * from './fields';
export { Entity, EntitySchema };
interface EntitySchema {
    [K: string]: Class<Entity<any>> extends Class<Entity<infer R>> ? Class<Entity<R>> : never;
}
