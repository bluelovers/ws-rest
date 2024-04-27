import { IESJzoneChapter, IESJzoneChapterLocked, IESJzoneChapterOptions } from '../types';
export declare function _handleChapterContentRoot($: JQueryStatic, argv: {
    novel_id: string | number;
    chapter_id: string | number;
}, options: IESJzoneChapterOptions): JQuery<HTMLElement>;
export declare function _handleChapterContentCore($: JQueryStatic, argv: {
    novel_id: string | number;
    chapter_id: string | number;
}, options: IESJzoneChapterOptions): {
    locked: boolean;
    imgs: string[];
    text: string;
    html: string;
};
export declare function _handleChapterContent($: JQueryStatic, argv: {
    novel_id: string | number;
    chapter_id: string | number;
}, options: IESJzoneChapterOptions): Pick<IESJzoneChapterLocked, 'locked' | 'imgs' | 'text' | 'html'> | Pick<IESJzoneChapter, 'locked' | 'imgs' | 'text' | 'html'>;
