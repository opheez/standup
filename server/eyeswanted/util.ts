import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {EyesWanted, PopulatedEyesWanted} from './model';

// Update this if you add a property to the EyesWanted type!
type EyesWantedResponse = {
  _id: string;
  update: any;
  targetUsers: any[];
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do, YYYY');

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

/**
 * Formats populated update object
 * 
 * @param {Object} update - Populated update object
 * @returns {Object} - Formatted update object
 */
 const formatPopulatedUpdate = (update: any): any => {
  const updateCopy = {...update};
  const authorCopy = updateCopy.authorId;
  const dateCreatedCopy = updateCopy.dateCreated;
  const dateModifiedCopy = updateCopy.dateModified;
  delete updateCopy.authorId;
  delete updateCopy.dateCreated;
  delete updateCopy.dateModified;
  updateCopy.author = formatPopulatedUser(authorCopy);
  updateCopy.dateCreated = formatDate(dateCreatedCopy);
  updateCopy.dateModified = formatDate(dateModifiedCopy);
  return updateCopy;
}

/**
 * Transform a raw  EyesWanted object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<EyesWanted>} eyesWanted - An EyesWanted entry
 * @returns {EyesWantedResponse} - The EyesWanted object formatted for the frontend
 */
const constructEyesWantedResponse = (eyesWanted: HydratedDocument<EyesWanted>): EyesWantedResponse => {
  const eyesWantedCopy: PopulatedEyesWanted = {
    ...eyesWanted.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const update = eyesWantedCopy.updateId;
  delete eyesWantedCopy.updateId;
  return {
    ...eyesWantedCopy,
    _id: eyesWantedCopy._id.toString(),
    update: formatPopulatedUpdate(update),
    targetUsers: eyesWantedCopy.targetUsers.map(formatPopulatedUser),
    dateCreated: formatDate(eyesWantedCopy.dateCreated),
  };
};

export {
  constructEyesWantedResponse
};
