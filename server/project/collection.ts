import {HydratedDocument, Types} from 'mongoose';
import type {Project} from './model';
import ProjectModel from './model';
import UserCollection from '../user/collection';
import UpdateCollection from 'server/update/collection';

/**
 * This files contains a class that has the functionality to explore projects
 * stored in MongoDB, including adding, finding, updating, and deleting projects.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Project> is the output of the ProjectModel() constructor,
 * and contains all the information in Project. https://mongoosejs.com/docs/typescript.html
 */
class ProjectCollection {

  static async populateProject(project: HydratedDocument<Project>) {
    // await project.populate([
    //   {
    //     path: 'participants',
    //     populate: {path: 'projects'}
    //   },
    //   {
    //     path: 'invitedUsers',
    //     populate: {path: 'freetId'}
    //   }
    // ]);
    await project.populate(['creatorId', 'participants', 'invitedUsers']);
  }

  /**
   * Add a project to the collection
   *
   * @param {string} creatorId - The id of the creator of the project
   * @param {string} projectName - The name of the project
   * @param {string[]} tags - The tags of the project
   * @return {Promise<HydratedDocument<Project>>} - The newly created project
   */
  static async addOne(creatorId: Types.ObjectId | string, projectName: string, scheduledUpdates?: string[], invitedUsers?: (Types.ObjectId | string)[], tags?: string[]): Promise<HydratedDocument<Project>> {
    const project = new ProjectModel({
      creatorId,
      projectName,
      scheduledUpdates,
      invitedUsers,
      participants: [creatorId],
      tags: tags ? tags : [],
    });
    await project.save(); // Saves project to MongoDB
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  /**
   * Find a project by projectId
   *
   * @param {string} projectId - The id of the project to find
   * @return {Promise<HydratedDocument<Project>> | Promise<null> } - The project with the given projectId, if any
   */
  static async findOne(projectId: Types.ObjectId | string): Promise<HydratedDocument<Project>> {
    const project = await ProjectModel.findOne({_id: projectId});
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  /**
   * Get all the projects in the database
   *
   * @return {Promise<HydratedDocument<Project>[]>} - An array of all of the projects
   */
  static async findAll(): Promise<Array<HydratedDocument<Project>>> {
    // Retrieves projects and sorts them from most to least recent
    const projects = await ProjectModel.find({}).sort({dateCreated: -1});
    await Promise.all(projects.map(this.populateProject));
    return projects;
  }

  /**
   * Get all the projects a user belongs to
   *
   * @param {string} userId - The id of user
   * @return {Promise<HydratedDocument<Project>[]>} - An array of all of the projects
   */
  static async findAllWithUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Project>>> {
    const projects = await ProjectModel.find({participants: userId});
    await Promise.all(projects.map(this.populateProject));
    return projects;
  }

  /**
   * Get all the projects a user is invited to
   *
   * @param {string} userId - The id of user
   * @return {Promise<HydratedDocument<Project>[]>} - An array of all of the projects
   */
  static async findAllInvitedUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Project>>> {
    const projects = await ProjectModel.find({invitedUsers: userId});
    await Promise.all(projects.map(this.populateProject));
    return projects;
  }

  /**
   * Update a project
   *
   * @param {string} projectId - The id of the project to be updated
   * @param {string} newName? - The new name of the project
   * @param {Date[]} newDates? - The new scheduled dates of the project
   * @param {(Types.ObjectId | string)[]} newParticipants? - The id of the project participants
   * @param {(Types.ObjectId | string)[]} newInvitedUsers? - The id of the invited users
   * @param {string[]} newTags? - The new tags of the project
   * @return {Promise<HydratedDocument<Project>>} - The newly updated project
   */
  static async updateOne(projectId: Types.ObjectId | string,
                         newName?: string,
                         newDates?: Date[],
                         newParticipants?: (Types.ObjectId | string)[],
                         newInvitedUsers?: (Types.ObjectId | string)[],
                         newTags?: string[]): Promise<HydratedDocument<Project>> {
    const project = await ProjectModel.findOne({_id: projectId});
    if (newName !== undefined){
      project.projectName = newName;
    }
    if (newDates !== undefined){
      project.scheduledUpdates = newDates;
    }
    if (newParticipants !== undefined){
      project.participants = newParticipants.map(user => new Types.ObjectId(user));
    }
    if (newInvitedUsers !== undefined){
      project.invitedUsers = newInvitedUsers.map(user => new Types.ObjectId(user));
    }
    if (newTags !== undefined) {
      const removedTags = project.tags.filter((tag) => !newTags.includes(tag));
      for (const tag of removedTags) {
        await UpdateCollection.deleteTagByProject(tag, projectId);
      }
      
      project.tags = newTags;
    }
    await project.save();
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  /**
   * Accept/reject invitation
   *
   * @param {string} projectId - The id of the project to be updated
   * @param {Types.ObjectId[]} userId - the id of the user accepting invitation
   * @param {boolean} accept - true if user accepted, false if rejected
   * @return {Promise<HydratedDocument<Project>>} - The newly updated project
   */
  static async respondInvite(projectId: Types.ObjectId | string, userId: Types.ObjectId | string, accept: boolean): Promise<HydratedDocument<Project>> {
    if (accept) {
      await ProjectModel.updateMany({_id: projectId}, {$pull: {invitedUsers: userId}, $push: {participants: userId}});
    } else {
      await ProjectModel.updateMany({_id: projectId}, {$pull: {invitedUsers: userId}});
    }
    const project = await ProjectModel.findOne({_id: projectId});
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  /**
   * Archive a project with given projectId.
   *
   * @param {string} projectId - The projectId of project to archive
   * @return {Promise<HydratedDocument<Project>>} - archived project
   */
  static async archiveOne(projectId: Types.ObjectId | string): Promise<HydratedDocument<Project>> {
    const project = await ProjectModel.findOne({_id: projectId});
    project.active = false;
    await project.save();
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  /**
   * Delete a project with given projectId.
   *
   * @param {string} projectId - The projectId of project to delete
   * @return {Promise<Boolean>} - true if the project has been deleted, false otherwise
   */
  static async deleteOne(projectId: Types.ObjectId | string): Promise<boolean> {
    const project = await ProjectModel.deleteOne({_id: projectId});
    return project !== null;
  }

  /**
   * Delete all the projects by the given creator
   *
   * @param {string} creatorId - The id of creator of projects
   */
  static async deleteMany(creatorId: Types.ObjectId | string): Promise<void> {
    await ProjectModel.deleteMany({creatorId});
  }
}

export default ProjectCollection;
