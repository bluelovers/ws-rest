export function printIndexLabel(index: number, langth: number)
{
	return `${index.toString().padStart(4, '0')}/${langth.toString().padStart(4, '0')}`
}
