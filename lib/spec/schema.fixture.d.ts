import { Entity } from '../types/schema';
import { ActionType } from 'typesafe-actions';
import { Repository } from '../types/redux-orm';
import * as actions from './action.fixture';
export { Vod, VodContent, VodId, Content, Source };
declare type Links = {
    self: string;
};
declare type RootAction = ActionType<typeof actions>;
declare class Vod extends Entity<Vod> {
    modelName: "Vod";
    id: import("../types/schema/fields").AttributeField<Vod, string>;
    title?: import("../types/schema/fields").AttributeField<Vod, string> | undefined;
    links: import("../types/schema/fields").AttributeField<Vod, Links>;
    sources: import("../types/schema/fields").OneToManyField<Vod, Source, any>;
    vodId?: import("../types/schema/fields").OneToOneField<Vod, VodId, any> | undefined;
    contents: import("../types/schema/fields").ManyToManyField<Vod, Content, VodContent, any, any>;
    reduce(action: RootAction, repository: Repository<Vod>): void;
}
export declare type SourceType = 'MOVIE' | 'PREVIEW' | 'POSTER';
declare class Source extends Entity<Source> {
    id: import("../types/schema/fields").AttributeField<Source, string>;
    modelName: "Source";
    type: import("../types/schema/fields").AttributeField<Source, SourceType>;
    vod: import("../types/schema/fields").ManyToOneField<Source, Vod, any>;
    reduce(action: RootAction, repository: Repository<Source>): void;
}
declare class VodId extends Entity<VodId> {
    id: import("../types/schema/fields").AttributeField<VodId, string>;
    modelName: "VodId";
    vod?: import("../types/schema/fields").OneToOneField<VodId, Vod, any> | undefined;
}
export declare type ContentType = 'MOVIE' | 'PREVIEW' | 'POSTER';
declare class Content extends Entity<Content> {
    id: import("../types/schema/fields").AttributeField<Content, string>;
    modelName: "Content";
    type: import("../types/schema/fields").AttributeField<Content, SourceType>;
    vods: import("../types/schema/fields").ManyToManyField<Content, Vod, VodContent, any, any>;
}
declare class VodContent extends Entity<VodContent> {
    id: import("../types/schema/fields").AttributeField<VodContent, string>;
    modelName: "VodContent";
    vod: import("../types/schema/fields").ManyToOneField<VodContent, Vod, any>;
    content: import("../types/schema/fields").ManyToOneField<VodContent, Content, any>;
}
