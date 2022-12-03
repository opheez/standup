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
    updateValidator.isUpdateInActiveProject,
    updateValidator.isUpdateExistsBody,
    updateValidator.isUpdateAuthorBody,
  ],
  async (req: Request, res: Response) => {
    const updateId = req.body.updateId as string;
    const userId = req.session.userId as string;
    const eyesWanted = await EyesWantedCollection.addOne(updateId, userId);

    res.status(201).json({
      message: 'Your Eyes Wanted was created successfully.',
      eyesWanted: util.constructEyesWantedResponse(eyesWanted)
    });
  }
);

/**
 * Delete an EyesWanted
 *
 * @name DELETE /api/eyesWanted/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the eyesWanted
 * @throws {404} - If the eyesWantedId is not valid
 */
router.delete(
  '/:eyesWantedId?',
  [
    userValidator.isUserLoggedIn,
    eyesWantedValidator.isEyesWantedExists,
    eyesWantedValidator.isEyesWantedAuthor,
  ],
  async (req: Request, res: Response) => {
    await EyesWantedCollection.deleteOne(req.params.eyesWantedId);
    res.status(200).json({
      message: 'Your Eyes Wanted was deleted successfully.'
    });
  }
);

/**
 * Modify an Eyes Wanted to show that the current user has read it
 *
 * @name PATCH /api/eyeswanted/:id
 *
 * @return {EyesWantedResponse} - the updated EyesWanted
 * @throws {403} - if the user is not logged in or not in the project
 * @throws {404} - If the eyesWantedId is not valid
 */
router.patch(
  '/:eyesWantedId?',
  [
    userValidator.isUserLoggedIn,
    eyesWantedValidator.isEyesWantedExists,
    eyesWantedValidator.isUserInProject,
  ],
  async (req: Request, res: Response) => {
    const eyesWantedId = req.params.eyesWantedId as string;
    const userId =  req.session.userId as string;
    const eyesWanted = await EyesWantedCollection.updateOneByIdAndReader(eyesWantedId, userId);
    res.status(200).json({
      message: `You have successfully read Eyes Wanted ${eyesWantedId}.`,
      eyesWanted: util.constructEyesWantedResponse(eyesWanted)
    });
  }
);

export {router as eyesWantedRouter};
