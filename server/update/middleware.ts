import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UpdateCollection from '../update/collection';

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if an update with updateId in req.query exists
 */
 const isUpdateExistsQuery = async (req: Request, res: Response, next: NextFunction) => {
  const updateId = req.query.updateId as string;
  if (!updateId) {
    res.status(400).json({
      error: 'update ID cannot be empty.'
    });
    return;
  }
  const validFormat = Types.ObjectId.isValid(updateId);
  const update = validFormat ? await UpdateCollection.findOneByUpdateId(updateId) : '';
  if (!update) {
    res.status(404).json({
      error: `Update with ID ${updateId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if an update with updateId in req.params exists
 */
 const isUpdateExistsParams = async (req: Request, res: Response, next: NextFunction) => {
  const updateId = req.params.updateId as string;
  if (!updateId) {
    res.status(400).json({
      error: 'update ID cannot be empty.'
    });
    return;
  }
  const validFormat = Types.ObjectId.isValid(updateId);
  const update = validFormat ? await UpdateCollection.findOneByUpdateId(updateId) : '';
  if (!update) {
    res.status(404).json({
      error: `Update with ID ${updateId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the update whose updateId is in req.params
 */
 const isUpdateAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const update = await UpdateCollection.findOneByUpdateId(req.params.updateId);
  const userId = update.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify or delete other users\' updates.'
    });
    return;
  }

  next();
};

export {
  isUpdateExistsQuery,
  isUpdateExistsParams,
  isUpdateAuthor,
};
