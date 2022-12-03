import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EyesWantedCollection from './collection';
import UpdateCollection from '../update/collection';
import ProjectCollection from '../project/collection';

/**
 * Checks if an Eyes Wanted with eyesWantedId in req.params exists
 */
const isEyesWantedExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.eyesWantedId);
  const eyesWanted = validFormat ? await EyesWantedCollection.findOne(req.params.eyesWantedId) : '';
  if (!eyesWanted) {
    res.status(404).json({
      error: `Eyes Wanted with ID ${req.params.eyesWantedId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the EyesWanted whose eyesWantedId is in req.params
 */
const isEyesWantedAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const eyesWanted = await EyesWantedCollection.findOne(req.params.eyesWantedId);
  const update = await UpdateCollection.findOneByUpdateId(eyesWanted.updateId);
  const userId = update.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' Eyes Wanted.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is in the project of the EyesWanted with id in req.params
 */
 const isUserInProject = async (req: Request, res: Response, next: NextFunction) => {
  const eyesWanted = await EyesWantedCollection.findOne(req.params.eyesWantedId);
  const update = await UpdateCollection.findOneByUpdateId(eyesWanted.updateId);
  const project = await ProjectCollection.findOne(update.projectId);
  const participants = project.participants.map((participant) => participant.toString());
  if (!participants.includes(req.session.userId)) {
    res.status(403).json({
      error: 'Cannot modify other users\' Eyes Wanted.'
    });
    return;
  }

  next();
};

export {
  isEyesWantedExists,
  isEyesWantedAuthor,
  isUserInProject,
};
