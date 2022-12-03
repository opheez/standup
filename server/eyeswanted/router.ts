import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import EyesWantedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as updateValidator from '../update/middleware';
import * as eyesWantedValidator from '../eyeswanted/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get EyesWanted for the logged-in user.
 *
 * @name GET /api/eyeswanted
 * 
 * @return {EyesWantedResponse[]} - An array of EyesWanted targeting the logged-in user
 * @throws {403} - If the user is not logged in
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const readingList = await EyesWantedCollection.findAllByUserId(userId);
    const response = readingList.map(util.constructEyesWantedResponse);
    res.status(200).json(response);
  },
);

/**
 * Create a new EyesWanted.
 *
 * @name POST /api/eyeswanted
 *
 * @param {string} updateId - The id of the update for the EyesWanted
 * @return {EyesWantedResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    updateValidator.isUpdateExistsBody,
    updateValidator.isUpdateAuthorBody,
  ],
  async (req: Request, res: Response) => {
    const updateId = req.body.updateId as string;
    const eyesWanted = await EyesWantedCollection.addOne(updateId);

    res.status(201).json({
      message: 'Your Eyes Wanted was created successfully.',
      eyesWanted: util.constructEyesWantedResponse(eyesWanted)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetRouter};
