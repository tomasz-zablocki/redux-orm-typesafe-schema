/// <reference types="redux-orm" />
import { Class, OptionalKeys, PickByValue, RequiredKeys, SetIntersection } from 'utility-types';
import { AttributeField, Entity, EntityKeys, EntitySchema, Primitive, RelationField, RelationType } from '../schema';
import { OrmModel, OrmSession } from './aliases';
export { OrmSelector, Ref, ModelAttributeFields, ModelRelationField, ModelRelationFields, Model, QuerySet, MutableQuerySet, Repository, Session, TypedModel };
declare type ModelAttributeFields<E extends Entity<E>, T = Pick<E, EntityKeys.Attribute<E>>> = {
    [K in keyof T]: T[K] extends AttributeField<E, infer R> ? R : T[K];
};
declare type ModelRelationField<E extends Entity<E>, K extends EntityKeys.Relation<E, RelationType>> = Required<E>[K] extends RelationField<infer RKind, E, infer To, infer K> ? RKind extends 'OneToOne' | 'ManyToOne' ? Model<To> : RKind extends 'OneToMany' ? QuerySet<To> : MutableQuerySet<To> : never;
declare type ModelRelationFields<E extends Entity<E>> = {
    [K in EntityKeys.Relation<E, RelationType>]: ModelRelationField<E, K>;
};
declare type RequiredRef<E extends Entity<E>> = {
    [K in SetIntersection<RequiredKeys<E>, keyof PickByValue<E, RefFieldTypes>>]: E[K] extends AttributeField<E, infer R> ? R : string | TypedModel<any>;
};
declare type OptionalRef<E extends Entity<E>> = {
    [K in SetIntersection<OptionalKeys<E>, keyof PickByValue<Required<E>, RefFieldTypes>>]?: Required<E>[K] extends AttributeField<E, infer R> ? R : string;
};
declare type Ref<E extends Entity<E>> = RequiredRef<E> & OptionalRef<E>;
declare type Model<E extends Entity<E>> = ModelAttributeFields<E> & ModelRelationFields<E> & {
    delete(): void;
    ref: Ref<E>;
};
interface QuerySet<E extends Entity<E>> {
    toRefArray(): ReadonlyArray<Ref<E>>;
    toModelArray(): ReadonlyArray<Model<E>>;
    count(): number;
    exists(): boolean;
    at(index: number): Model<E> | undefined;
    first(): Model<E> | undefined;
    last(): Model<E> | undefined;
    all(): QuerySet<E>;
    filter(lookupObj: Partial<Ref<E>>): QuerySet<E>;
    exclude(lookupObj: Partial<Ref<E>>): QuerySet<E>;
    orderBy(iterateeArray: QuerySet.SortIteratee<E>[], orders: QuerySet.SortOrder[]): QuerySet<E>;
    update(props: Partial<Ref<E>>): void;
    delete(): void;
}
declare namespace QuerySet {
    type SortOrder = 'asc' | true | 'desc' | false;
    type SortIteratee<E extends Entity<E>> = keyof Model<E> | {
        (model: Model<E>): Primitive;
    };
}
interface MutableQuerySet<E extends Entity<E>> extends QuerySet<E> {
    add: (idOrModel: string | Model<E>) => void;
    remove: (idOrModel: string | Model<E>) => void;
}
interface Dao<E extends Entity<E>> {
    create: (props: Ref<E>) => Model<E>;
    upsert: (props: Partial<Ref<E>>) => Model<E>;
    withId: (id: string) => Model<E> | null;
    hasId: (id: string) => boolean;
}
interface Repository<E extends Entity<E>> extends Dao<E>, QuerySet<E> {
}
declare type Session<E extends EntitySchema> = {
    [k in keyof E]: E[k] extends Class<Entity<infer R>> ? Repository<R> : never;
} & OrmSession & {};
declare class TypedModel<E extends Entity<E>> extends OrmModel<ModelAttributeFields<E>, ModelRelationFields<E>> {
}
declare type OrmSelector<E extends EntitySchema, Result> = (repositories: Session<E>) => Result;
