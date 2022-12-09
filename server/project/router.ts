import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProjectCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as projectValidator from '../project/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Get projects a user is in or invited to
 *
 * @name GET /api/projects?invited=invited
 *
 * @return {ProjectResponse[]} - An array of projects the user is in or invited to
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const invited = req.query.invited as string;
    const authorProjects = (invited === "true")
      ? await ProjectCollection.findAllInvitedUser(req.session.userId)
      : await ProjectCollection.findAllWithUser(req.session.userId);
    const response = authorProjects.map(util.constructProjectResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new project.
 *
 * @name POST /api/projects
 *
 * @param {string} projectName - the name for the project
 * @param {string} scheduledUpdates - the scheduled dates for the project
 * @param {string[]} invitedUsers - the invitees for the project
 * @param {string[]} tags - the tags on the project
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isValidProjectFields
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const invitedUsers = await Promise.all((req.body.invitedUsers as string[])
      .map(email => UserCollection.findOneByEmail(email)));
    const invitedUserIds = invitedUsers.map(user => user._id);
    const tags = req.body.tags ? util.cleanTags(req.body.tags) : undefined;
    const project = await ProjectCollection.addOne(
      userId, req.body.projectName, req.body.scheduledUpdates, invitedUserIds, tags);

    res.status(201).json({
      message: 'Your project was created successfully.',
      project: util.constructProjectResponse(project)
    });
  }
);

/**
 * Archive a project
 *
 * @name PATCH /api/projects/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the project
 * @throws {404} - If the projectId is not valid
 */
router.patch(
  '/:projectId?',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExists,
    projectValidator.isValidProjectModifier
  ],
  async (req: Request, res: Response) => {
    await ProjectCollection.archiveOne(req.params.projectId);
    res.status(200).json({
      message: 'Your project was archived successfully.'
    });
  }
);

/**
 * Modify a project - project characteristics like name/deadlines, or inviting/uninviting users
 *
 * @name PATCH /api/projects/:id
 *
 * @param {string} projectName - the new name for the project
 * @param {string} scheduledUpdates - the new scheduled dates for the project
 * @param {string[]} invitedUsers - the new invitees for the project
 * @param {string[]} tags - the new tags for the project
 * @return {ProjectResponse} - the updated project
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the project
 * @throws {404} - If the projectId is not valid
 */
router.patch(
  '/:projectId?',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExists,
    projectValidator.isValidProjectModifier,
    projectValidator.isValidProjectFields
  ],
  async (req: Request, res: Response) => {
    const tags = req.body.tags ? util.cleanTags(req.body.tags) : undefined;
    console.log(tags);
    const project = await ProjectCollection.updateOne(req.params.projectId, req.body.projectName, req.body.scheduledUpdates, undefined, req.body.invitedUsers, tags);
    res.status(200).json({
      message: 'Your project was updated successfully.',
      project: util.constructProjectResponse(project)
    });
  }
);

/**
 * Accept/reject an invitation to a project
 *
 * @name PATCH /api/projects/:id
 *
 * @return {ProjectResponse} - the updated project
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the project
 * @throws {404} - If the projectId is not valid
 */
router.patch(
  '/:projectId/:response',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExists,
    projectValidator.isValidProjectInvitee,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const project = await ProjectCollection.respondInvite(req.params.projectId, userId, req.params.response === 'accept');
    res.status(200).json({
      message: 'Your project was updated successfully.',
      project: util.constructProjectResponse(project)
    });
  }
);

// /**
//  * Remove a user from a project
//  *
//  * @name PATCH /api/projects/:id
//  *
//  * @param {string} newName - the new name for the project
//  * @param {string} newDates - the new scheduled dates for the project
//  * @param {string} newInvitedUsers - the new invitees for the project
//  * @return {ProjectResponse} - the updated project
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the project
//  * @throws {404} - If the projectId is not valid
//  */
// router.patch(
//   '/:projectId?',
//   [
//     userValidator.isUserLoggedIn,
//     projectValidator.isProjectExists,
//     projectValidator.isValidProjectModifier,
//   ],
//   async (req: Request, res: Response) => {
//     const project = await ProjectCollection.updateOne(req.params.projectId, req.body.newName, req.body.newDates, req.body.newInvitedUsers);
//     res.status(200).json({
//       message: 'Your project was updated successfully.',
//       project: util.constructProjectResponse(project)
//     });
//   }
// );

export {router as projectRouter};
