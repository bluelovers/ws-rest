import { zhRegExp } from 'regexp-cjk';

export const reAuthors = new zhRegExp(/作者\s*[：:]\s*([^\n]+)/);

export const reTitle = new zhRegExp(/(?:书|書)名\s*[：:]\s*([^\n]+)/);

export const reType = new zhRegExp(/類型\s*[：:]\s*([^\n]+)/);
