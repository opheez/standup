import type {Request, Response} from 'express';
import express from 'express';
import UpdateCollection from './collection';
import * as userValidator from '../user/middleware';
import * as projectValidator from '../project/middleware';
import * as updateValidator from './middleware';
import * as util from './util';

const router = express.Router();

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
    projectValidator.isProjectExistsQuery,
    projectValidator.isUserInProject,
  ],
  async (req: Request, res: Response) => {
    const updates = await UpdateCollection.findAllByProjectId(req.query.projectId as string);
    const response = updates.map(util.constructUpdateResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new update.
 *
 * @name POST /api/updates
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @return {UpdateResponse} - An object with the new update
 * @throws {400} - If projectId is not given
 * @throws {403} - If user is not logged in or not part of the project
 * @throws {404} - If project with projectId is not found
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    projectValidator.isProjectExistsQuery,
    projectValidator.isUserInProject,
  ],
  async (req: Request, res: Response) => {
    
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
    updateValidator.isUpdateAuthor,
  ],
  async (req: Request, res: Response) => {
    await UpdateCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your update was deleted successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} firstName - first name of user
 * @param {string} lastName - last name of user
 * @param {string} email - email of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isValidName,
    userValidator.isEmailNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.firstName + ' ' + user.lastName}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PATCH /api/users
 *
 * @param {string} firstName - first name of user
 * @param {string} lastName - last name of user
 * @param {string} email - The user's new email
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If email already taken
 * @throws {400} - If email or password are not of the correct format
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidOrUndefinedEmail,
    userValidator.isValidOrUndefinedFirstName,
    userValidator.isValidOrUndefinedLastName,
    userValidator.isEmailNotAlreadyInUse,
    userValidator.isValidOrUndefinedPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    // await FreetCollection.deleteMany(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

export {router as userRouter};
