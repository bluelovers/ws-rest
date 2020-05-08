/**
 * Created by user on 2020/5/8.
 */

export function parseMangaKey(pathname: string | URL): string
{
	return ((pathname as URL).pathname ?? (pathname as string)).match(/\bmanga-(.+).html$/)?.[1]
}

export function parseReadUrl(pathname: string | URL)
{
	let m = ((pathname as URL).pathname ?? (pathname as string)).match(/\bread-(.+)-chapter-(.+).html$/);

	return {
		id_key: m[1],
		chapter_id: m[2],
	}
}
