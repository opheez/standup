import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Update} from './model';
import UpdateModel from './model';

/**
 * This file contains a class with functionality to interact with updates stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Update> is the output of the UpdateModel() constructor,
 * and contains all the information in Update. https://mongoosejs.com/docs/typescript.html
 */
class UpdateCollection {
  /**
   * Add a new update
   *
   * @param {string} updateId - The id of the author of the update
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * TODO: add projects
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(firstName: string, lastName: string, email: string, password: string): Promise<HydratedDocument<User>> {
    const date = new Date();
    const update = new UpdateModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await update.save(); // Saves freet to MongoDB
    return update.populate('authorId');
  }

  /**
   * Find a update by updateId.
   *
   * @param {string} updateId - The updateId of the update to update
   * @return {Promise<HydratedDocument<Update>> | Promise<null>} - The update with the given updateId, if any
   */
  static async findOneByUpdateId(updateId: Types.ObjectId | string): Promise<HydratedDocument<Update>> {
    return UpdateModel.findOne({_id: updateId});
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmail(email: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') });
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmailAndPassword(email: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${email.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: {password?: string; email?: string; firstName?: string; lastName?: string}): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.firstName) {
      user.firstName = userDetails.firstName;
    }

    if (userDetails.lastName) {
      user.lastName = userDetails.lastName;
    }

    if (userDetails.password) {
      user.password = userDetails.password;
    }

    if (userDetails.email) {
      user.email = userDetails.email;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a update from the collection.
   *
   * @param {string} userId - The updateId of update to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(updateId: Types.ObjectId | string): Promise<boolean> {
    const update = await UpdateModel.deleteOne({_id: updateId});
    return update !== null;
  }
}

export default UpdateCollection;
