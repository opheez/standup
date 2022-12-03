import type {HydratedDocument, Types} from 'mongoose';
import type {EyesWanted} from './model';
import EyesWantedModel from './model';
import UserCollection from '../user/collection';
import ProjectCollection from '../project/collection';
import UpdateCollection from '../update/collection';

/**
 * This files contains a class that has the functionality to explore EyesWanted
 * stored in MongoDB, including adding, finding, updating, and deleting EyesWanted.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<EyesWanted> is the output of the EyesWantedModel() constructor,
 * and contains all the information in EyesWanted. https://mongoosejs.com/docs/typescript.html
 */
class EyesWantedCollection {
  /**
   * Add an EyesWanted to the collection
   *
   * @param {Types.ObjectId | string} updateId - The id of the update
   * @return {Promise<HydratedDocument<EyesWanted>>} - The newly created eyesWanted
   */
  static async addOne(updateId: Types.ObjectId | string): Promise<HydratedDocument<EyesWanted>> {
    const date = new Date();
    const update = await UpdateCollection.findOneByUpdateId(updateId);
    const project = await ProjectCollection.findOne(update.projectId);
    const targetUsers = project.participants;
    const eyesWanted = await EyesWantedCollection.findOneByUpdateId(updateId);
    if (eyesWanted) {
      // Eyes Wanted already exists, so just re-add every user to it and overwrite the creation date
      eyesWanted.dateCreated = date;
      eyesWanted.targetUsers = targetUsers;
      await eyesWanted.save();
      return EyesWantedModel.findOne({ _id: eyesWanted._id }).populate(['updateId', 'targetUsers']);
    } else {
      const newEyesWanted = new EyesWantedModel({
        updateId,
        dateCreated: date,
        targetUsers,
      });
      await newEyesWanted.save(); // Saves freet to MongoDB
      return newEyesWanted.populate(['updateId', 'targetUsers']);
    }
  }

  /**
   * Get the EyesWanted for a given Update
   *
   * @param {Types.ObjectId | string} updateId - The id of the update
   * @return {Promise<HydratedDocument<EyesWanted>>} - The EyesWanted, if any
   */
   static async findOneByUpdateId(updateId: Types.ObjectId | string): Promise<HydratedDocument<EyesWanted>> {
    return EyesWantedModel.findOne({ updateId }).populate(['updateId', 'targetUsers']);
  }

  /**
   * Get all the EyesWanted targeting a given user
   *
   * @param {Types.ObjectId | string} userId - The user
   * @return {Promise<HydratedDocument<EyesWanted>[]>} - An array of all of the EyesWanted
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<EyesWanted>>> {
    return EyesWantedModel.find({ targetUsers: userId }).populate(['updateId', 'targetUsers']);
  }

  /**
   * Update an EyesWanted to reflect that a user has read it
   *
   * @param {Types.ObjectId | string} eyesWantedId - The id of the EyesWanted to be updated
   * @param {Types.ObjectId | string} reader - The id of the user that just read the update
   * @return {Promise<HydratedDocument<EyesWanted>>} - The newly updated freet
   */
  static async updateOneByIdAndReader(eyesWantedId: Types.ObjectId | string, reader: Types.ObjectId | string): Promise<HydratedDocument<EyesWanted>> {
    await EyesWantedModel.updateOne({ _id: eyesWantedId }, { $pull: { targetUsers: reader }});
    return EyesWantedModel.findOne({ _id: eyesWantedId }).populate(['authorId', 'targetUsers']);
  }

  /**
 * Update the EyesWanted for an Update to reflect that a user has read it
 *
 * @param {Types.ObjectId | string} updateId - The id of the Update whose EyesWanted is to be updated
 * @param {Types.ObjectId | string} reader - The id of the user that just read the update
 * @return {Promise<HydratedDocument<EyesWanted>>} - The newly updated freet
 */
    static async updateOneByUpdateAndReader(updateId: Types.ObjectId | string, reader: Types.ObjectId | string): Promise<HydratedDocument<EyesWanted>> {
    await EyesWantedModel.updateOne({ updateId }, { $pull: { targetUsers: reader }});
    return EyesWantedModel.findOne({ updateId }).populate(['authorId', 'targetUsers']);
  }

  /**
   * Delete an Eyes Wanted by its id
   *
   * @param {Types.ObjectId | string} eyesWantedId - The id of the Eyes Wanted entry to delete
   * @return {Promise<Boolean>} - true if the EyesWanted has been deleted, false otherwise
   */
   static async deleteOne(updateId: Types.ObjectId | string): Promise<boolean> {
    const eyesWanted = await EyesWantedModel.deleteOne({ updateId });
    return eyesWanted !== null;
  }

  /**
   * Delete an Eyes Wanted by its update id
   *
   * @param {Types.ObjectId | string} updateId - The id of the update whose Eyes Wanted entry to delete
   * @return {Promise<Boolean>} - true if the EyesWanted has been deleted, false otherwise
   */
  static async deleteOneByUpdateId(updateId: Types.ObjectId | string): Promise<boolean> {
    const eyesWanted = await EyesWantedModel.deleteOne({ updateId });
    return eyesWanted !== null;
  }
}

export default EyesWantedCollection;
