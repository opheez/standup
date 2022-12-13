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
   * @param {Types.ObjectId | string} authorId - The id of the author of the update
   * @param {string} status - The status of the update
   * @param {string} summary - The summary of the update
   * @param {string} details - The details of the update
   * @param {string[] | undefined} actionItems - The action items of the update
   * @param {string[] | undefined} tags - The tags of the update
   * @param {Types.ObjectId | string} projectId - The id of the project the update is associated with
   * @return {Promise<HydratedDocument<Update>>} - The newly created update
   */
  static async addOne(authorId: Types.ObjectId | string, 
                      status: string, 
                      summary: string, 
                      details: string, 
                      actionItems: string[] | undefined,
                      tags: string[] | undefined,
                      projectId: Types.ObjectId | string): Promise<HydratedDocument<Update>> {
    const date = new Date();
    const update = new UpdateModel({
      authorId,
      dateCreated: date,
      dateModified: date,
      status,
      summary,
      details,
      actionItems: actionItems ? actionItems : [],
      tags: tags ? tags : [],
      projectId,
    });
    await update.save(); // Saves update to MongoDB
    return update.populate('authorId');
  }

  /**
   * Find a update by updateId.
   *
   * @param {string} updateId - The updateId of the update to find
   * @return {Promise<HydratedDocument<Update>> | Promise<null>} - The update with the given updateId, if any
   */
  static async findOneByUpdateId(updateId: Types.ObjectId | string): Promise<HydratedDocument<Update>> {
    return UpdateModel.findOne({_id: updateId});
  }

  /**
   * Find all updates by projectId.
   *
   * @param {Types.ObjectId | string} projectId - The id of the project
   * @return {Promise<HydratedDocument<Update>[]>} - The updates with the given projectId
   */
   static async findAllByProjectId(projectId: Types.ObjectId | string): Promise<HydratedDocument<Update>[]> {
    return UpdateModel.find({ projectId }).sort({ dateCreated: -1 }).populate('authorId');
  }

  /**
   * Find all updates by projectId for multiple projects.
   *
   * @param {Types.ObjectId[] | string[]} projectIds - The ids of the projects
   * @return {Promise<HydratedDocument<Update>[]>} - The updates with the given projectId
   */
   static async findAllByProjectIds(projectIds: Types.ObjectId[] | string[]): Promise<HydratedDocument<Update>[]> {
    return UpdateModel.find({ projectId: { $in: projectIds } }).sort({ dateCreated: -1 }).populate('authorId');
  }

  /**
   * Find all updates by author.
   *
   * @param {string} authorId - The id of the author
   * @return {Promise<HydratedDocument<Update>[]>} - The updates with the given projectId
   */
   static async findAllByAuthorId(authorId: Types.ObjectId | string): Promise<HydratedDocument<Update>[]> {
    return UpdateModel.find({ authorId }).sort({ dateCreated: -1 }).populate('authorId');
  }

  /**
   * Deletes a given tag from every update in the project with given project id.
   *
   * @param {string} tag - The tag to delete
   * @param {string} projectId - The id of the project
   * @return {Promise<void>} - The updates with the given projectId
   */
   static async deleteTagByProject(tag: string, projectId: Types.ObjectId | string): Promise<void> {
    await UpdateModel.updateMany({ projectId }, { $pull: { tags: tag }});
  }

  /**
   * Updates an update
   *
   * @param {string} updateId - The id of the update to update
   * @param {Object} updateDetails - An object with the updated update
   * @return {Promise<HydratedDocument<Update>>} - The updated update
   */
  static async updateOne(updateId: Types.ObjectId | string, 
                         updateDetails: { status?: string;
                                          summary?: string;
                                          details?: string;
                                          actionItems?: string[];
                                          tags?: string[];
                                        }): Promise<HydratedDocument<Update>> {
    const date = new Date();
    const update = await UpdateModel.findOne({ _id: updateId });
    if (updateDetails.status) {
      update.status = updateDetails.status;
    }

    if (updateDetails.summary) {
      update.summary = updateDetails.summary;
    }

    if (updateDetails.details) {
      update.details = updateDetails.details;
    }

    if (updateDetails.actionItems !== undefined) {
      update.actionItems = updateDetails.actionItems;
    }

    if (updateDetails.tags !== undefined) {
      update.tags = updateDetails.tags;
    }

    // note: this will update dateModified whenever the update is updated, regardless of whether the information actually changed
    update.dateModified = date;
    await update.save();
    return update.populate('authorId');
  }

  /**
   * Delete a update from the collection.
   *
   * @param {Types.ObjectId | string} updateId - The updateId of update to delete
   * @return {Promise<Boolean>} - true if the update has been deleted, false otherwise
   */
  static async deleteOne(updateId: Types.ObjectId | string): Promise<boolean> {
    const update = await UpdateModel.deleteOne({_id: updateId});
    return update !== null;
  }

  /**
   * Deletes multiple updates from the collection.
   *
   * @param {Types.ObjectId[] | string[]} updateId - The ids of the updates to delete
   * @return {Promise<Boolean>} - true if the update has been deleted, false otherwise
   */
   static async deleteMany(updateIds: Types.ObjectId[] | string[]): Promise<boolean> {
    const updates = await UpdateModel.deleteMany({ updateId: { $in: updateIds } });
    return updates !== null;
  }

  /**
   * Deletes updates from the collection by project.
   *
   * @param {Types.ObjectId | string} projectId - The id of the project whose updates to delete
   * @return {Promise<Boolean>} - true if the update has been deleted, false otherwise
   */
   static async deleteManyByProjectId(projectId: Types.ObjectId | string): Promise<boolean> {
    const update = await UpdateModel.deleteMany({ projectId });
    return update !== null;
  }

  /**
   * Deletes updates from the collection by author.
   *
   * @param {Types.ObjectId | string} authorId - The id of the user whose updates to delete
   * @return {Promise<Boolean>} - true if the update has been deleted, false otherwise
   */
   static async deleteManyByAuthorId(authorId: Types.ObjectId | string): Promise<boolean> {
    const update = await UpdateModel.deleteMany({ authorId });
    return update !== null;
  }
}

export default UpdateCollection;
