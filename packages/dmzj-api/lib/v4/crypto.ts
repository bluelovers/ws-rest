import { constants, createPrivateKey, KeyObject, privateDecrypt } from "crypto";
import { BinaryLike, createHash as createCryptoHash, Hash } from "crypto";

const block_size = 1024 / 8;

export const rsa_key = "MIICXgIBAAKBgQCvJzUdZU5yHyHrOqEViTY95gejrLAxsdLhjKYKW1QqX+vlcJ7iNrLZoWTaEHDONeyM+1qpT821JrvUeHRCpixhBKjoTnVWnofV5NiDz46iLuU25C2UcZGN3STNYbW8+e3f66HrCS5GV6rLHxuRCWrjXPkXAAU3y2+CIhY0jJU7JwIDAQABAoGBAIs/6YtoSjiSpb3Ey+I6RyRo5/PpS98GV/i3gB5Fw6E4x2uO4NJJ2GELXgm7/mMDHgBrqQVoi8uUcsoVxaBjSm25737TGCueoR/oqsY7Qy540gylp4XAe9PPbDSmhDPSJYpersVjKzDAR/b9jy3WLKjAR6j7rSrv0ooHhj3oge1RAkEA4s1ZTb+u4KPfUACL9p/4GuHtMC4s1bmjQVxPPAHTp2mdCzk3p4lRKrz7YFJOt8245dD/6c0M8o4rcHuh6AgCKQJBAMWzrZwptbihKeR7DWlxCU8BO1kH+z6yw+PgaRrTSpII2un+heJXeEGdk0Oqr7Aos0hia4zqTXY1Rie24GDHHM8CQQC7yVjy5g4u06BXxkwdBLDR2VShOupGf/Ercfns7npHuEueel6Zajn5UAY2549j4oMATf9Gn0/kGVDgTo1s6AyZAkApc6PqA0DLxlbPRhGo0v99pid4YlkGa1rxM4M2Eakn911XBHuz2l0nfM98t5QAnngArEoakKHPMBpWh1yCTh03AkEAmcOddu2RrPGQ00q6IKx+9ysPx71+ecBgHoqymHL9vHmrr3ghu4shUdDxQfz/xA2Z8m/on78hBZbnD1CNPmPOxQ==";
export const key = createPrivateKeyV4(rsa_key);

export function decryptBuffer(key: KeyObject, buffer: Buffer)
{
	const block_count = buffer.length;
	const blocks = [];

	let i = 0;
	while (i < block_count)
	{
		blocks.push(buffer.slice(i, i += block_size))
	}

	return Buffer.concat(blocks.map(p => privateDecrypt({
		key: key,
		padding: constants.RSA_PKCS1_PADDING,
	}, p)))
}

export function decryptBase64(key: KeyObject, base64: string)
{
	const buffer = Buffer.from(base64, "base64");

	return decryptBuffer(key, buffer)
}

export function createPrivateKeyV4(rsa_key: string)
{
	return createPrivateKey({
		key: Buffer.from(rsa_key, "base64"),
		format: "der",
		type: "pkcs1",
	})
}

export function md5_hex(data: BinaryLike)
{
	return createCryptoHash("md5").update(data).digest('hex').toLowerCase()
}

export function decryptBufferV4(buffer: Buffer)
{
	return decryptBuffer(key, buffer)
}

export function decryptBase64V4(base64: string)
{
	return decryptBase64(key, base64)
}
