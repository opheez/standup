import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Update, PopulatedUpdate} from './model';
import type {User} from '../user/model';

// Update this if you add a property to the Update type!
type UpdateResponse = {
  _id: string;
  author: any;
  dateCreated: string;
  dateModified: string;
  status: string;
  summary: string;
  details: string;
  todos: string[];
  blockers: string[];
  projectId: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Update object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Update>} update - A update object
 * @returns {UpdateResponse} - The update object
 */
const constructUpdateResponse = (update: HydratedDocument<Update>): UpdateResponse => {
  const updateCopy: Update = {
    ...update.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const author = updateCopy.authorId;
  delete updateCopy.authorId;
  return {
    ...updateCopy,
    _id: updateCopy._id.toString(),
    author: formatPopulatedUser(author),
    dateCreated: formatDate(updateCopy.dateCreated),
    dateModified: formatDate(updateCopy.dateModified),
    projectId: updateCopy.projectId.toString(),
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
  constructUpdateResponse
};
