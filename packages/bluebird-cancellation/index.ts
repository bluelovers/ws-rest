
import IBluebird from 'bluebird'

export const Bluebird = IBluebird.getNewLibraryCopy();

Bluebird.config({
	cancellation: true
});

export default Bluebird
