/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="jquery" />
import { IMasiroMeChapter } from '../types';
export declare function _getChapter($: JQueryStatic, chapter_id: string | number, options?: {
    rawHtml?: boolean;
    cb?(data: {
        i: number;
        $elem: JQuery<HTMLElement>;
        $content: JQuery<HTMLElement>;
        src: string;
        imgs: string[];
    }): void;
}): IMasiroMeChapter;
