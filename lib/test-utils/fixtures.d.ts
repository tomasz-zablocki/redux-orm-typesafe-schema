import { Entity } from '../types/schema';
import { ActionType } from 'typesafe-actions';
import { Repository } from '../types/redux-orm/mapped';
export declare type Links = {
    self: string;
};
export declare class Vod extends Entity<Vod, 'Vod'> {
    id: import("../types/schema/fields").AttributeField<Vod, string>;
    title: import("../types/schema/fields").AttributeField<Vod, string>;
    links: import("../types/schema/fields").AttributeField<Vod, Links>;
    sources: import("../types/schema/fields").OneToManyField<Vod, Source, any>;
    vodId: import("../types/schema/fields").OneToOneField<Vod, VodId, any>;
    contents: import("../types/schema/fields").ManyToManyField<Vod, Content, VodContent, any, any>;
    constructor();
    reduce<AType extends ActionType<any>>(action: AType, repository: Repository<Vod>): void;
}
export declare type SourceType = 'MOVIE' | 'PREVIEW' | 'POSTER';
export declare class Source extends Entity<Source, 'Source'> {
    type: import("../types/schema/fields").AttributeField<Source, SourceType>;
    vod: import("../types/schema/fields").ManyToOneField<Source, Vod, any>;
    constructor();
    reduce<AType extends ActionType<any>>(action: AType, repository: Repository<Source>): void;
}
export declare class VodId extends Entity<VodId, 'VodId'> {
    vod: import("../types/schema/fields").OneToOneField<VodId, Vod, any>;
    constructor();
}
export declare class Content extends Entity<Content, 'Content'> {
    vods: import("../types/schema/fields").ManyToManyField<Content, Vod, VodContent, any, any>;
    constructor();
}
export declare class VodContent extends Entity<VodContent, 'VodContent'> {
    vod: import("../types/schema/fields").ManyToOneField<VodContent, Vod, any>;
    content: import("../types/schema/fields").ManyToOneField<VodContent, Content, any>;
    constructor();
}
export declare const schema: import("../types/redux-orm/mapped").Repositories<{
    Vod: typeof Vod;
    Source: typeof Source;
    VodId: typeof VodId;
    Content: typeof Content;
    VodContent: typeof VodContent;
}>;
export declare function testType<T>(): T;
