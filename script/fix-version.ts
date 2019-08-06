import { parseStaticPackagesPaths, getConfig } from 'workspaces-config';
import Bluebird from 'bluebird';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import path from 'upath2';
import { readJSON, writeJSON } from 'fs-extra';
import IPackageJson from '@ts-type/package-dts/package-json';

console.log(parseStaticPackagesPaths(getConfig()));

FastGlob
	.async(parseStaticPackagesPaths(getConfig()).all.map(v => path.join(v, 'package.json')), {
		cwd: path.join(__dirname, '..'),
		absolute: true,
	})
	.reduce(async (a, file) =>
	{

		let json = await readJSON(file) as IPackageJson;

		a[json.name] = {
			name: json.name,
			version: json.version,
			file,
			json,
		};

		return a

	}, {} as Record<string, {
		name: string,
		version: string,
		file: string,
		json: IPackageJson,
	}>)
	.then(data =>
	{

		return Bluebird
			.resolve(Object.keys(data))
			.map(name =>
			{

				const row = data[name];
				let changed: boolean;

				([
					'devDependencies',
					'dependencies',
					'peerDependencies',
					'optionalDependencies',
				] as (keyof IPackageJson)[]).forEach(key =>
				{

					let map = row.json[key];

					if (map != null)
					{
						Object.entries(map)
							.forEach(([k, v]) =>
							{

								let r = data[k];

								if (r)
								{
									let v2 = `^${r.version}`;

									if (v2 != v)
									{
										map[k] = v2;
										changed = true;
									}
								}

							})
						;
					}

				});

				if (changed)
				{
					return writeJSON(row.file, row.json, {
						spaces: 2,
					})
						.then(v => console.log(row.file))
				}

			})
			;
	})
;

