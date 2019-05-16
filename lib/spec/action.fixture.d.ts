import { SourceType } from '@spec/schema.fixture';
declare type Links = {
    self: string;
};
declare type VodPayload = {
    id: string;
    title?: string;
    vodId?: string;
    links: Links;
};
declare type SourcePayload = {
    id: string;
    type: SourceType;
    vod: string;
};
export declare const insertVod: (payload: VodPayload) => {
    type: "INSERT_VOD";
} & {
    payload: VodPayload;
};
export declare const insertSource: (payload: SourcePayload) => {
    type: "INSERT_SOURCE";
} & {
    payload: SourcePayload;
};
export declare const deleteSource: (payload: string) => {
    type: "DELETE_SOURCE";
} & {
    payload: string;
};
export declare const updateVod: (payload: Partial<VodPayload>) => {
    type: "UPDATE_VOD";
} & {
    payload: Partial<VodPayload>;
};
export {};
