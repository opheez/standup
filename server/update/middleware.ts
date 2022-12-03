import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ProjectCollection from '../project/collection';
import UpdateCollection from '../update/collection';

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
 * Checks if an update with updateId in req.body exists
 */
 const isUpdateExistsBody = async (req: Request, res: Response, next: NextFunction) => {
  const updateId = req.body.updateId as string;
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
 const isUpdateAuthorParams = async (req: Request, res: Response, next: NextFunction) => {
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

/**
 * Checks if the current user is the author of the update whose updateId is in req.body
 */
 const isUpdateAuthorBody = async (req: Request, res: Response, next: NextFunction) => {
  const update = await UpdateCollection.findOneByUpdateId(req.body.updateId);
  const userId = update.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify or delete other users\' updates.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is in the project of the update with id in req.query 
 */
 const isUserInProject = async (req: Request, res: Response, next: NextFunction) => {
  const update = await UpdateCollection.findOneByUpdateId(req.query.updateId as string);
  const project = await ProjectCollection.findOne(update.projectId);
  const userId = req.session.userId as string;
  const participants = project.participants.map((participant) => participant.toString());
  if (!participants.includes(userId)) {
    res.status(403).json({
      error: 'Cannot view updates for projects you are not in.'
    });
    return;
  }

  next();
};

/**
 * Checks if the update with id in req.body is in an active project
 */
 const isUpdateInActiveProject = async (req: Request, res: Response, next: NextFunction) => {
  const updateId = req.body.updateId as string;
  const update = await UpdateCollection.findOneByUpdateId(updateId);
  const project = await ProjectCollection.findOne(update.projectId);
  if (!project.active) {
    res.status(403).json({
      error: 'The project this update is in is inactive.'
    });
    return;
  }

  next();
};

/**
 * Checks if the update content in req.body is valid for creation 
 */
 const isValidUpdateContentCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { status, summary, details, todos, blockers } = req.body as { 
    status: string, 
    summary: string, 
    details: string, 
    todos: string[], 
    blockers: string[] 
  };
   
  // status must be 'inprogress', 'completed', or 'blocked'
  if (!['inprogress', 'completed', 'blocked'].includes(status)) {
    res.status(400).json({
      error: 'Status must be either "inprogress", "completed", or "blocked".'
    });
    return;
  }

  // summary must be defined, a non-empty string, and fewer than 60 characters long
  if (summary === undefined) {
    res.status(400).json({
      error: 'Summary cannot be undefined.'
    });
    return;
  }

  if (typeof summary !== 'string') {
    res.status(401).json({
      error: 'Summary must be a string.'
    });
    return;
  }

  if (summary.trim().length === 0) {
    res.status(401).json({
      error: 'Summary cannot be empty.'
    });
    return;
  }

  if (summary.trim().length > 60) {
    res.status(401).json({
      error: 'Summary cannot be longer than 60 characters.'
    });
    return;
  }

  // details must be defined and a non-empty string
  if (details === undefined) {
    res.status(400).json({
      error: 'Details cannot be undefined.'
    });
    return;
  }

  if (typeof details !== 'string') {
    res.status(401).json({
      error: 'Details must be a string.'
    });
    return;
  }

  if (details.trim().length === 0) {
    res.status(401).json({
      error: 'Details cannot be empty.'
    });
    return;
  }

  // todos, if defined, must be a list of strings
  if (todos) {
    if (!Array.isArray(todos)) {
      res.status(401).json({
        error: 'Todos must be a list.'
      });
      return;
    }

    for (const elt of todos) {
      if (typeof elt !== 'string') {
        res.status(401).json({
          error: 'Todos must be a list of strings.'
        });
        return;
      }
    }
  }

  // blockers, if defined, must be a list of strings
  if (blockers) {
    if (!Array.isArray(blockers)) {
      res.status(401).json({
        error: 'Blockers must be a list.'
      });
      return;
    }

    for (const elt of blockers) {
      if (typeof elt !== 'string') {
        res.status(401).json({
          error: 'Blockers must be a list of strings.'
        });
        return;
      }
    }
  }

  next();
};

/**
 * Checks if the update content in req.body is valid for editing 
 * (i.e., undefined is a valid value for any field)
 */
 const isValidUpdateContentEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { status, summary, details, todos, blockers } = req.body as { 
    status: string, 
    summary: string, 
    details: string, 
    todos: string[], 
    blockers: string[] 
  };
   
  // status, if defined, must be 'inprogress', 'completed', or 'blocked'
  if (status && !['inprogress', 'completed', 'blocked'].includes(status)) {
    res.status(400).json({
      error: 'Status must be either "inprogress", "completed", or "blocked".'
    });
    return;
  }

  // summary, if defined, must be a non-empty string and fewer than 60 characters long
  if (summary !== undefined) {
    if (typeof summary !== 'string') {
      res.status(401).json({
        error: 'Summary must be a string.'
      });
      return;
    }

    if (summary.trim().length === 0) {
      res.status(401).json({
        error: 'Summary cannot be empty.'
      });
      return;
    }

    if (summary.trim().length > 60) {
      res.status(401).json({
        error: 'Summary cannot be longer than 60 characters.'
      });
      return;
    }
  }

  // details, if defined, must be a non-empty string
  if (details !== undefined) {
    if (typeof details !== 'string') {
      res.status(401).json({
        error: 'Details must be a string.'
      });
      return;
    }

    if (details.trim() === '') {
      res.status(401).json({
        error: 'Details cannot be empty.'
      });
      return;
    }
  }

  // todos, if defined, must be a list of strings
  if (todos) {
    if (!Array.isArray(todos)) {
      res.status(401).json({
        error: 'Todos must be a list.'
      });
      return;
    }

    for (const elt of todos) {
      if (typeof elt !== 'string') {
        res.status(401).json({
          error: 'Todos must be a list of strings.'
        });
        return;
      }
    }
  }

  // blockers, if defined, must be a list of strings
  if (blockers) {
    if (!Array.isArray(blockers)) {
      res.status(401).json({
        error: 'Blockers must be a list.'
      });
      return;
    }

    for (const elt of blockers) {
      if (typeof elt !== 'string') {
        res.status(401).json({
          error: 'Blockers must be a list of strings.'
        });
        return;
      }
    }
  }

  next();
};

export {
  isUpdateExistsQuery,
  isUpdateExistsParams,
  isUpdateExistsBody,
  isUpdateAuthorParams,
  isUpdateAuthorBody,
  isValidUpdateContentCreate,
  isValidUpdateContentEdit,
  isUserInProject,
  isUpdateInActiveProject,
};
