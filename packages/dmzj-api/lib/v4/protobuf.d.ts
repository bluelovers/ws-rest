import protobuf, { Type, Reader, Long } from "protobufjs";
import { ITSOverwrite } from "ts-type/lib/type/record";
export declare const enum EnumResponseTypeKey {
    Root = "Root",
    NovelChapterResponse = "NovelChapterResponse",
    NovelDetailResponse = "NovelDetailResponse"
}
export declare function _lookupType<T extends Type>(path: EnumResponseTypeKey): protobuf.Type;
export declare function lookupTypeRoot(): protobuf.Root;
export declare function lookupTypeNovelChapterResponse(): ITSOverwrite<Type, {
    decode(reader: (Reader | Uint8Array), length?: number): {
        Data: {
            VolumeId: number;
            VolumeName: string;
            VolumeOrder: number;
            Chapters: {
                ChapterId: number;
                ChapterName: string;
                ChapterOrder: number;
            }[];
        }[];
    };
}>;
export declare function lookupTypeNovelDetailResponse(): ITSOverwrite<Type, {
    decode(reader: (Reader | Uint8Array), length?: number): {
        Data: {
            Authors: string;
            Cover: string;
            LastUpdateTime: Long;
            Introduction: string;
            Name: string;
            Status: string;
            Types: string[];
            Volume: {
                VolumeId: number;
                LnovelId: number;
                VolumeName: string;
                VolumeOrder: number;
                Addtime: Long;
                SumChapters: number;
            }[];
            NovelId: number;
            Zone: string;
            LastUpdateVolumeName: string;
            LastUpdateChapterName: string;
            LastUpdateVolumeId: number;
            LastUpdateChapterId: number;
            HotHits: number;
            FirstLetter: string;
            SubscribeNum: number;
        };
    };
}>;
export declare function protoLongToNumber(long: Long): number;
export declare function protoLongToMilliseconds(long: Long): number;
