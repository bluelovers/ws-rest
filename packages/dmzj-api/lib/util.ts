/**
 * Created by user on 2019/7/1.
 */
import { IDmzjNovelInfoWithChapters, IDmzjNovelInfo, IDmzjNovelInfoRecentUpdateRow } from './types';
import cloneDeep from 'lodash/cloneDeep';
import { array_unique } from 'array-hyper-unique';
import { crlf } from 'crlf-normalize';
import { removeZeroWidth } from 'zero-width';
import sortObject from 'sort-object-keys2';

export { removeZeroWidth }

export function buildVersion()
{
	return {
		channel: "Android",
		version: "2.7.003",
	}
}

/**
 * 修正 dmzj 小說標籤
 */
export function fixDmzjNovelTags(tags: string | string[])
{
	if (typeof tags === 'string')
	{
		tags = [tags];
	}

	return array_unique(tags.reduce((a, b) =>
	{
		a.push(...b.split('/').map(trimUnsafe));
		return a
	}, [] as string[]))
}

/**
 * 修正 dmzj 上面一些錯誤的資料
 */
export function fixDmzjNovelInfo<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T)
{
	data = cloneDeep(data);

	data.name = trimUnsafe(data.name);
	data.authors = trimUnsafe(data.authors);
	data.status = trimUnsafe(data.status);
	data.last_update_volume_name = trimUnsafe(data.last_update_volume_name);
	data.last_update_chapter_name = trimUnsafe(data.last_update_chapter_name);
	data.types = fixDmzjNovelTags(data.types);

	if (isDmzjNovelInfoFull(data))
	{
		data.zone = trimUnsafe(data.zone);

		data.introduction = removeZeroWidth(crlf(data.introduction))
			.replace(/^\n+/, '')
			.replace(/[\u00A0]/gu, ' ')
			.replace(/[\s　]+$/g, '')
			.replace(/^ {3,}/gm, '  ')
		;

		if (data.first_letter != null)
		{
			data.first_letter = trimUnsafe(data.first_letter).toUpperCase();
		}

		data.volume.forEach(vol =>
		{
			vol.volume_name = trimUnsafe(vol.volume_name)
		});
	}

	if (isDmzjNovelInfoFullWithChapters(data))
	{
		data.chapters.forEach(ch =>
		{
			ch.volume_name = trimUnsafe(ch.volume_name);

			ch.chapters.forEach(c =>
			{
				c.chapter_name = trimUnsafe(c.chapter_name);
			})
		});
	}

	return sortDmzjNovelInfo(data)
}

export function trimUnsafe<T extends string>(input: T): T
{
	// @ts-ignore
	return removeZeroWidth(input)
		.replace(/^\s+|\s+$/gu, '')
		.replace(/\r|\n|[\u00A0]/gu, ' ')
		.replace(/\s+/gu, ' ')
		.trim()
}

export function isDmzjNovelInfoFull<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): data is Extract<IDmzjNovelInfo | IDmzjNovelInfoWithChapters, T>
{
	// @ts-ignore
	if (data.zone && data.volume)
	{
		return true;
	}
}

export function isDmzjNovelInfoFullWithChapters<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): data is Extract<IDmzjNovelInfoWithChapters, T>
{
	// @ts-ignore
	if (isDmzjNovelInfoFull(data) && data.chapters)
	{
		return true;
	}
}

export function sortDmzjNovelInfoVolumes<T extends IDmzjNovelInfo["volume"] | IDmzjNovelInfoWithChapters["volume"]>(volumes: T)
{
	volumes.forEach(volume =>
	{
		sortObject(volume, {
			keys: [
				"id",
				"lnovel_id",
				"volume_name",
				"volume_order",
				"addtime",
				"sum_chapters",
			],
			useSource: true,
		})
	})

	return volumes
}

export function sortDmzjNovelInfoChapters<T extends IDmzjNovelInfoWithChapters["chapters"]>(chapters: T)
{
	chapters.forEach(chapter =>
	{

		sortObject(chapter, {
			keys: [
				"volume_id",
				"id",
				"volume_name",
				"volume_order",
				"chapters",
			],
			useSource: true,
		});

		chapter.chapters?.forEach?.(chapter =>
		{
			sortObject(chapter, {
				keys: [
					"chapter_id",
					"chapter_name",
					"chapter_order",
				],
				useSource: true,
			})
		});

	})

	return chapters
}

export function sortDmzjNovelInfo<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): T
{
	sortObject(data, {
		keys: [
			'id',
			'name',
			'zone',
			'status',
			'last_update_volume_name',
			'last_update_chapter_name',
			'last_update_volume_id',
			'last_update_chapter_id',
			'last_update_time',
			'cover',
			'hot_hits',
			'introduction',
			'types',
			'authors',
			'first_letter',
			'subscribe_num',
			'redis_update_time',
			'volume',
			'chapters',
		],
		useSource: true,
	});

	if ((data as IDmzjNovelInfo).volume?.length)
	{
		sortDmzjNovelInfoVolumes((data as IDmzjNovelInfo).volume)
	}

	if ((data as IDmzjNovelInfoWithChapters).chapters?.length)
	{
		sortDmzjNovelInfoChapters((data as IDmzjNovelInfoWithChapters).chapters)
	}

	return data
}
