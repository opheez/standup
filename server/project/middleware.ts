import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ProjectCollection from '../project/collection';

/**
 * Checks if a project with projectId is req.params exists
 */
const isProjectExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.projectId);
  const project = validFormat ? await ProjectCollection.findOne(req.params.projectId) : '';
  if (!project) {
    res.status(404).json({
      error: `Project with project ID ${req.params.projectId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the project in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidProjectContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Project content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Project content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the project whose projectId is in req.params
 */
const isValidProjectModifier = async (req: Request, res: Response, next: NextFunction) => {
  const project = await ProjectCollection.findOne(req.params.projectId);
  const userId = project.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' projects.'
    });
    return;
  }

  next();
};

export {
  isValidProjectContent,
  isProjectExists,
  isValidProjectModifier
};
