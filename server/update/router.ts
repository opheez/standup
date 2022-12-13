import type {Request, Response, NextFunction} from 'express';
import express from 'express';
import UpdateCollection from './collection';
import * as userValidator from '../user/middleware';
import * as projectValidator from '../project/middleware';
import * as updateValidator from './middleware';
import * as util from './util';
import ThanksCollection from '../thanks/collection';
import EyesWantedCollection from '../eyeswanted/collection';

const router = express.Router();

/**
 * Get a given update by id
 *
 * @name GET /api/updates?updateId=updateId
 *
 * @return {UpdateResponse} - The update with id updateId
 * @throws {400} - If updateId is not given
 * @throws {403} - If user is not logged in or not part of the project the update is part of
 * @throws {404} - If update with updateId is not found
 */
/**
 * Get updates for a given project
 *
 * @name GET /api/updates?projectId=projectId
 *
 * @return {UpdateResponse[]} - An array of updates associated with the given project
 * @throws {400} - If projectId is not given
 * @throws {403} - If user is not logged in or not part of the project
 * @throws {404} - If project with projectId is not found
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExistsQueryOrUpdateId,
    projectValidator.isUserInProjectQueryOrUpdateId,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if updateId parameters was supplied instead
    if (req.query.updateId !== undefined) { 
      next();
      return;
    }

    const updates = await UpdateCollection.findAllByProjectId(req.query.projectId as string);
    const response = updates.map(util.constructUpdateResponse);
    res.status(200).json(response);
  },
  [
    updateValidator.isUserInProject,
  ],
  async (req: Request, res: Response) => {
    const update = await UpdateCollection.findOneByUpdateId(req.query.updateId as string);
    const response = util.constructUpdateResponse(update);
    res.status(200).json(response);
  },
);

/**
 * Create a new update.
 *
 * @name POST /api/updates
 *
 * @param {string} status - The status of the update
 * @param {string} summary - The summary of the update
 * @param {string} details - The details of the update
 * @param {string[] | undefined} actionItems - The action items of the update
 * @param {string[] | undefined} tags - The tags of the update
 * @param {string} projectId - The id of the project the update is associated with
 * @return {UpdateResponse} - An object with the new update
 * @throws {400} - If projectId is not given, or if required update content is not given, or update content is invalid
 * @throws {403} - If user is not logged in or not part of the project
 * @throws {404} - If project with projectId is not found
 * @throws {413} - If summary exceeds 60 characters
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExistsBody,
    projectValidator.isUserInProjectBody,
    projectValidator.isProjectActive,
    updateValidator.isValidUpdateContentCreate,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const { status, summary, details, actionItems, tags, projectId } = req.body;
    const update = await UpdateCollection.addOne(userId, status, summary, details, actionItems, tags, projectId);
    res.status(201).json({
      message: 'Your update was created successfully.',
      update: util.constructUpdateResponse(update),
    });
  }
);

/**
 * Update an update.
 *
 * @name PATCH /api/update
 *
 * @param {string} status - The status of the update
 * @param {string} summary - The summary of the update
 * @param {string} details - The details of the update
 * @param {string[] | undefined} actionItems - The action items of the update
 * @param {string[] | undefined} tags - The tags of the update
 * @return {UserResponse} - The updated user
 * @throws {400} - If projectId is not given, or if update content is invalid
 * @throws {403} - If user is not logged in or not part of the project
 * @throws {404} - If project with projectId is not found
 * @throws {413} - If summary exceeds 60 characters
 */
router.patch(
  '/:updateId?',
  [
    userValidator.isUserLoggedIn,
    updateValidator.isUpdateExistsParams,
    updateValidator.isUpdateAuthorParams,
    updateValidator.isValidUpdateContentEdit,
  ],
  async (req: Request, res: Response) => {
    const updateId = req.params.updateId as string;
    const update = await UpdateCollection.updateOne(updateId, req.body);
    res.status(200).json({
      message: 'Your update was updated successfully.',
      update: util.constructUpdateResponse(update),
    });
  }
);

/**
 * Delete an update
 *
 * @name DELETE /api/updates/:id
 *
 * @return {string} - A success message
 * @throws {403} - If user is not logged in or is not the author of the update
 *
 */
 router.delete(
  '/:updateId?',
  [
    userValidator.isUserLoggedIn,
    updateValidator.isUpdateExistsParams,
    updateValidator.isUpdateAuthorParams,
  ],
  async (req: Request, res: Response) => {
    await ThanksCollection.deleteManybyUpdate(req.params.updateId);
    await EyesWantedCollection.deleteOneByUpdateId(req.params.updateId);

    await UpdateCollection.deleteOne(req.params.updateId);

    res.status(200).json({
      message: 'Your update was deleted successfully.'
    });
  }
);


export {router as updateRouter};
