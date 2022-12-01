import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProjectCollection from './collection';
import * as userValidator from '../user/middleware';
import * as projectValidator from '../project/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Get projects a user is in.
 *
 * @name GET /api/projects
 *
 * @return {ProjectResponse[]} - An array of projects created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const authorProjects = await ProjectCollection.findAllWithUser(req.session.id);
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
 * @param {string} invitedUsers - the invitees for the project
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the project content is empty or a stream of empty spaces
 * @throws {413} - If the project content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isValidProjectContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const project = await ProjectCollection.addOne(userId, req.body.projectName, req.body.scheduledUpdates, req.body.invitedUsers);

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
 * Modify a project
 *
 * @name PATCH /api/projects/:id
 *
 * @param {string} newName - the new name for the project
 * @param {string} newDates - the new scheduled dates for the project
 * @param {string} newInvitedUsers - the new invitees for the project
 * @return {ProjectResponse} - the updated project
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the project
 * @throws {404} - If the projectId is not valid
 * @throws {400} - If the project content is empty or a stream of empty spaces
 * @throws {413} - If the project content is more than 140 characters long
 */
router.patch(
  '/:projectId?',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExists,
    projectValidator.isValidProjectModifier,
    projectValidator.isValidProjectContent
  ],
  async (req: Request, res: Response) => {
    const project = await ProjectCollection.updateOne(req.params.projectId, req.body.newName, req.body.newDates, req.body.newInvitedUsers);
    res.status(200).json({
      message: 'Your project was updated successfully.',
      project: util.constructProjectResponse(project)
    });
  }
);

export {router as projectRouter};
