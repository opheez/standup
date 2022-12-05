import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ThanksCollection from '../thanks/collection';

/**
 * Checks if a thanks with thanksId is req.params exists
 */
const isThanksExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.thanksId);
  const thanks = validFormat ? await ThanksCollection.findOne(req.params.thanksId) : '';
  if (!thanks) {
    res.status(404).json({
      error: `Thanks with ID ${req.params.thanksId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user has not already thanked the update
 */
 const isThanksNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.updateId);
  const thanks = validFormat ? await ThanksCollection.findOnebyUpdateandUser(req.params.updateId, req.session.userId) : '';
  if (thanks) {
    res.status(409).json({
      error: `You have already thanked the post.`
    });
    return;
  }

  next();
};


/**
 * Checks if the current user is the author of the thanks whose thanksId is in req.params
 */
const isValidThanksModifier = async (req: Request, res: Response, next: NextFunction) => {
  const thanks = await ThanksCollection.findOne(req.params.thanksId);
  const userId = thanks.postUser;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' thanks.'
    });
    return;
  }

  next();
};

export {
  isThanksNotExist,
  isThanksExists,
  isValidThanksModifier
};
