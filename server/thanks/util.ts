import type {HydratedDocument} from 'mongoose';
import type {Thanks, PopulatedThanks} from '../thanks/model';

// Update this if you add a property to the Freet type!
type ThanksResponse = {
  _id: string;
  postUser: string;
  updateId: string;
};

/**
 * Formats populated update object
 * 
 * @param {Object} update - Populated update object
 * @returns {Object} - Formatted update object
 */
 const formatPopulatedUpdate = (update: any): any => {
  const updateCopy = {...update};
  const authorCopy = updateCopy.authorId;
  delete updateCopy.authorId;
  updateCopy.author = formatPopulatedUser(authorCopy);
  return updateCopy;
}

/**
 * Transform a raw Thanks object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Thanks>} thanks - A thanks
 * @returns {ThanksResponse} - The thanks object formatted for the frontend
 */
const constructThanksResponse = (thanks: HydratedDocument<Thanks>): ThanksResponse => {
  const thanksCopy: PopulatedThanks = {
    ...thanks.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const update = thanksCopy.updateId;
  delete thanksCopy.updateId;
  return {
    ...thanksCopy,
    _id: thanksCopy._id.toString(),
    postUser: formatPopulatedUser(thanksCopy.postUser),
    updateId: formatPopulatedUpdate(update),
    // updateId: thanksCopy.updateId.toString(),
  };
};

/**
 * Formats populated user object
 * 
 * @param {Object} user - Populated user object
 * @returns {Object} - Formatted user object
 */
 const formatPopulatedUser = (user: any): any => {
  const userCopy = {...user};
  delete userCopy.password;
  return userCopy;
}

export {
  constructThanksResponse
};
