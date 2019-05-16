import { Entity } from '../types/schema';
import { ActionType } from 'typesafe-actions';
import { Repository } from '../types/redux-orm';
export { schema, Vod, VodContent, VodId, Content, Source };
declare type Links = {
    self: string;
};
declare class Vod extends Entity<Vod, 'Vod'> {
    id: import("../types/schema/fields").AttributeField<Vod, string>;
    title: import("../types/schema/fields").AttributeField<Vod, string>;
    links: import("../types/schema/fields").AttributeField<Vod, Links>;
    sources: import("../types/schema/fields").OneToManyField<Vod, Source, any>;
    vodId: import("../types/schema/fields").OneToOneField<Vod, VodId, any>;
    contents: import("../types/schema/fields").ManyToManyField<Vod, Content, VodContent, any, any>;
    constructor();
    reduce<AType extends ActionType<any>>(action: AType, repository: Repository<Vod>): void;
}
declare type SourceType = 'MOVIE' | 'PREVIEW' | 'POSTER';
declare class Source extends Entity<Source, 'Source'> {
    type: import("../types/schema/fields").AttributeField<Source, SourceType>;
    vod: import("../types/schema/fields").ManyToOneField<Source, Vod, any>;
    constructor();
    reduce<AType extends ActionType<any>>(action: AType, repository: Repository<Source>): void;
}
declare class VodId extends Entity<VodId, 'VodId'> {
    vod: import("../types/schema/fields").OneToOneField<VodId, Vod, any>;
    constructor();
}
declare class Content extends Entity<Content, 'Content'> {
    vods: import("../types/schema/fields").ManyToManyField<Content, Vod, VodContent, any, any>;
    constructor();
}
declare class VodContent extends Entity<VodContent, 'VodContent'> {
    vod: import("../types/schema/fields").ManyToOneField<VodContent, Vod, any>;
    content: import("../types/schema/fields").ManyToOneField<VodContent, Content, any>;
    constructor();
}
declare const schema: import("../types/redux-orm/mapped").Repositories<{
    Vod: typeof Vod;
    Source: typeof Source;
    VodId: typeof VodId;
    Content: typeof Content;
    VodContent: typeof VodContent;
}>;
