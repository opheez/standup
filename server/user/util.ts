import type {HydratedDocument} from 'mongoose';
import type {User} from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  // TODO: add projects
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    firstName: userCopy.firstName,
    lastName: userCopy.lastName,
    email: userCopy.email,
    // TODO: add projects
  };
};

export {
  constructUserResponse
};
