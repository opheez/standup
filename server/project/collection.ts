import {HydratedDocument, Types} from 'mongoose';
import type {Project} from './model';
import ProjectModel from './model';
import UserCollection from '../user/collection';

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
    await project.populate([
      // {
      //   path: 'intent',
      //   populate: {path: 'projects'}
      // },
      // {
      //   path: 'tags',
      //   populate: {path: 'freetId'}
      // },
      // {
      //   path: 'suggestions',
      //   populate: {path: 'freetId'}
      // }
    ]);
    await project.populate('creatorId');
  }

  /**
   * Add a project to the collection
   *
   * @param {string} creatorId - The id of the creator of the project
   * @param {string} projectName - The name of the project
   * @return {Promise<HydratedDocument<Project>>} - The newly created project
   */
  static async addOne(creatorId: Types.ObjectId | string, projectName: string, scheduledUpdates?: string[], invitedUsers?: (Types.ObjectId | string)[]): Promise<HydratedDocument<Project>> {
    const project = new ProjectModel({
      creatorId,
      projectName,
      scheduledUpdates,
      invitedUsers
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
   * Get all the projects a user belongs to
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
   * @return {Promise<HydratedDocument<Project>>} - The newly updated project
   */
  static async updateOne(projectId: Types.ObjectId | string,
                         newName?: string,
                         newDates?: Date[],
                         newParticipants?: (Types.ObjectId | string)[],
                         newInvitedUsers?: (Types.ObjectId | string)[]): Promise<HydratedDocument<Project>> {
    const project = await ProjectModel.findOne({_id: projectId});
    if (typeof newName !== 'undefined'){
      project.projectName = newName;
    }
    if (typeof newDates !== 'undefined'){
      project.scheduledUpdates = newDates;
    }
    if (typeof newParticipants !== 'undefined'){
      project.participants = newParticipants.map(user => new Types.ObjectId(user));
    }
    if (typeof newInvitedUsers !== 'undefined'){
      project.invitedUsers = newInvitedUsers.map(user => new Types.ObjectId(user));
    }
    await project.save();
    await Promise.resolve(this.populateProject(project));
    return project;
  }

  // /**
  //  * Update a project's participants
  //  *
  //  * @param {string} projectId - The id of the project to be updated
  //  * @param {Types.ObjectId[]} newParticipants? - The id of the project participants
  //  * @param {Types.ObjectId[]} newInvitedUsers? - The id of the invited users
  //  * @return {Promise<HydratedDocument<Project>>} - The newly updated project
  //  */
  // static async updateOneParticipants(projectId: Types.ObjectId | string,
  //                        newParticipants?: Types.ObjectId[],
  //                        newInvitedUsers?: Types.ObjectId[]): Promise<HydratedDocument<Project>> {
  //   const project = await ProjectModel.findOne({_id: projectId});
  //   if (typeof newParticipants !== 'undefined'){
  //     project.participants = newParticipants;
  //   }
  //   if (typeof newInvitedUsers !== 'undefined'){
  //     project.invitedUsers = newInvitedUsers;
  //   }
  //   await project.save();
  //   await Promise.resolve(this.populateProject(project));
  //   return project;
  // }

  /**
   * Archive a project with given projectId.
   *
   * @param {string} projectId - The projectId of project to archive
   * @return {Promise<Boolean>} - true if the project has been archived, false otherwise
   */
  static async archiveOne(projectId: Types.ObjectId | string): Promise<boolean> {
    const project = await ProjectModel.findOne({_id: projectId});
    project.active = false;
    return project !== null;
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
