import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Thanks, PopulatedThanks} from '../thanks/model';

// Update this if you add a property to the Freet type!
type ThanksResponse = {
  _id: string;
  postUser: string;
  updateId: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

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
  return {
    ...thanksCopy,
    _id: thanksCopy._id.toString(),
    postUser: formatPopulatedUser(thanksCopy.postUser),
    updateId: thanksCopy.updateId.toString(),
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
