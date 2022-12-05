import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ThanksCollection from './collection';
import * as userValidator from '../user/middleware';
import * as thanksValidator from '../thanks/middleware';
import * as updateValidator from '../update/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all Thanks.
 *
 * @name GET /api/thanks
 *
 * @return {ThanksResponse[]} - An array of Thanks got by the given user
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has the given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const allThanks = await ThanksCollection.findAll();
    const response = allThanks.map(util.constructThanksResponse);
    res.status(200).json(response);
  },
);

/**
 * Get all Thanks for one update
 *
 * @name GET /api/thanks/:updateId?
 *
 * @return {ThanksResponse[]} - An array of Thanks got by the given user
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has the given userId
 *
 */
 router.get(
  '/:updateId?',
  async (req: Request, res: Response, next: NextFunction) => {
    const allThanks = await ThanksCollection.findAllByUpdateId(req.params.updateId);
    const response = allThanks.map(util.constructThanksResponse);
    res.status(200).json(response);
  },
);

/**
 * Create a new thanks.
 *
 * @name POST /api/thanks
 *
 * @param {string} updateId - The Id of the update
 * @return {ThanksResponse} - The created thanks
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user has thanked the update
 * @throws {404} - If the update user wants to thank does not exist
 */
router.post(
  '/:updateId?',
  [
    userValidator.isUserLoggedIn,
    thanksValidator.isThanksNotExist,
    // updateValidator.isUpdateExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const thanks = await ThanksCollection.addOne(userId, req.params.updateId);

    res.status(201).json({
      message: 'Your thanks was created successfully.',
      freet: util.constructThanksResponse(thanks)
    });
  }
);

/**
 * Delete a thanks
 *
 * @name DELETE /api/thanks/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the poster of
 *                 the thanks
 * @throws {404} - If the thanksId is not valid
 * @throws {404} - If the updateId is not valid
 */
router.delete(
  '/:updateId?',
  [
    userValidator.isUserLoggedIn,
    // thanksValidator.isThanksExists,
    // updateValidator.isUpdateExistsQuery,
    // thanksValidator.isValidThanksModifier
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await ThanksCollection.deleteOne(userId, req.params.updateId);
    res.status(200).json({
      message: 'Your thanks was deleted successfully.'
    });
  }
);

export {router as thanksRouter};
