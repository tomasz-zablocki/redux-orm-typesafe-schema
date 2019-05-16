import { Class } from 'utility-types';
import { AttributeField, EntityBuilders, Serializable, Supplier } from './fields';
import { Repository, Session } from '../redux-orm';
import { AnyAction } from 'redux';
import OneToOneBuilder = EntityBuilders.OneToOneBuilder;
import ManyToManyBuilder = EntityBuilders.ManyToManyBuilder;
import ManyToOneBuilder = EntityBuilders.ManyToOneBuilder;
import OneToManyBuilder = EntityBuilders.OneToManyBuilder;
export { FieldType, Field, RelationType, RelationField, AttributeField, OneToOneField, OneToManyField, ManyToOneField, ManyToManyField, EntityKeys, EntityBuilders } from './fields';
declare abstract class Entity<E extends Entity<E>> {
    abstract readonly modelName: string;
    entityClass(): Class<E>;
    reduce(action: AnyAction, repository: Repository<E>, repositories?: Session<any>): void;
    attribute<ValueType extends Serializable>(supplier?: Supplier<ValueType>): AttributeField<E, ValueType>;
    oneToOne: OneToOneBuilder<E>;
    oneToMany: OneToManyBuilder<E>;
    manyToOne: ManyToOneBuilder<E>;
    manyToMany: ManyToManyBuilder<E>;
}
export { Entity };
