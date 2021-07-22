import { zhRegExp } from 'regexp-cjk';

export const reAuthors = new zhRegExp(/\s*作者\s*(?:：|:)\s*/);

export const reStates = new zhRegExp(/\s*状态\s*(?:：|:)\s*/);

export const reLastUpdateName = new zhRegExp(/\s*最新\s*(?:：|:)\s*/);

export const reDesc = new zhRegExp(/\s*简介\s*(?:：|:)\s*/);

export const re404 = new zhRegExp(/^\s*您好\s*(?:,|，)\s*此页面不存在\s*$/);
