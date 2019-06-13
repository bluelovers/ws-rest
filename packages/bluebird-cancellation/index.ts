
import IBluebird from 'bluebird'

export { IBluebird as BluebirdOrigin }

export const Bluebird: typeof import('bluebird') = IBluebird.getNewLibraryCopy() as typeof import('bluebird');

Bluebird.config({
	cancellation: true
});

export default Bluebird
