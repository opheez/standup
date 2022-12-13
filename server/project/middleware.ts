import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ProjectCollection from './collection';

/**
 * Checks if a project with projectId in req.params exists
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
 * Checks if a project with projectId in req.query exists
 * Or if updateId is given (needed so it doesn't flag GET /api/updates?updateId=updateId calls)
 */
 const isProjectExistsQueryOrUpdateId = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.updateId) {
    next();
    return;
  }

  const projectId = req.query.projectId as string;
  const validFormat = Types.ObjectId.isValid(projectId);
  const project = validFormat ? await ProjectCollection.findOne(projectId) : '';
  if (!project) {
    res.status(404).json({
      error: `Project with project ID ${projectId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a project with projectId in req.body exists
 */
 const isProjectExistsBody = async (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.body.projectId as string;
  const validFormat = Types.ObjectId.isValid(projectId);
  const project = validFormat ? await ProjectCollection.findOne(projectId) : '';
  if (!project) {
    res.status(404).json({
      error: `Project with project ID ${projectId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the project in req.body is valid, 
 * i.e. project name is non-empty and < 50 char, dates and users are valid values
 */
const isValidProjectFields = async (req: Request, res: Response, next: NextFunction) => {
  const {
    projectName,
    scheduledUpdates: scheduledUpdatesReq,
    invitedUsers: invitedUsersReq,
    tags,
  } = req.body as {projectName: string, scheduledUpdates: any[], invitedUsers: string[], tags: string[]};

  if (projectName === undefined) {
    res.status(400).json({
      error: 'Project name cannot be undefined.'
    });
    return;
  }

  if (!projectName.trim()) {
    res.status(400).json({
      error: 'Project name must be at least one character long.'
    });
    return;
  }

  if (projectName.length > 50) {
    res.status(413).json({
      error: 'Project content must be no more than 50 characters.'
    });
    return;
  }

  if (scheduledUpdatesReq === undefined) {
    res.status(400).json({
      error: 'Scheduled updates cannot be undefined.'
    });
    return;
  }

  if (!Array.isArray(scheduledUpdatesReq)) {
    res.status(400).json({
      error: 'Scheduled updates must be a list.'
    });
    return;
  }

  const scheduledUpdates = scheduledUpdatesReq.map(date => !isNaN(new Date(date).getTime()));
  const scheduledUpdatesErr = scheduledUpdates.indexOf(false);
  if (scheduledUpdatesErr !== -1) {
    res.status(400).json({
      error: `Project deadline ${scheduledUpdatesReq[scheduledUpdatesErr]} must be valid dates.`
    });
    return;
  }

  if (invitedUsersReq === undefined) {
    res.status(400).json({
      error: 'Invited users cannot be undefined.'
    });
    return;
  }

  if (!Array.isArray(invitedUsersReq)) {
    res.status(400).json({
      error: 'Invited users must be a list.'
    });
    return;
  }

  const invitedUsers = await Promise.all(invitedUsersReq.map(async (email) => {
    return UserCollection.findOneByEmail(email);
  }));
  const invitedUsersErr = invitedUsers.every(user => !!user);
  if (!invitedUsersErr) {
    res.status(404).json({
      error: 'Can only invite users with an existing account.'
    });
    return;
  }

  // if defined, tags must be a list of non-empty strings no longer than 50 characters
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      res.status(400).json({
        error: 'Tags must be a list.'
      });
      return;
    }

    for (const elt of tags) {
      if (typeof elt !== 'string') {
        res.status(400).json({
          error: 'Tags must be a list of strings.'
        });
        return;
      } else if (elt.trim().length === 0 || elt.trim().length > 50) {
        res.status(400).json({
          error: 'Tags must be between 1 and 50 characters long.'
        });
        return;
      }
    }
  }

  next();
};

/**
 * Checks if the content of the project in req.body is valid for an edit
 * i.e. project name is non-empty and < 50 char, dates and users are valid values, and fields can be undefined
 */
 const isValidProjectFieldsEdit = async (req: Request, res: Response, next: NextFunction) => {
  const {
    projectName,
    scheduledUpdates: scheduledUpdatesReq,
    invitedUsers: invitedUsersReq
  } = req.body as {projectName: string, scheduledUpdates: any[], invitedUsers: string[]};

  if (projectName !== undefined) {
    if (!projectName.trim()) {
      res.status(400).json({
        error: 'Project name must be at least one character long.'
      });
      return;
    }

    if (projectName.length > 50) {
      res.status(413).json({
        error: 'Project content must be no more than 50 characters.'
      });
      return;
    }
  }

  if (scheduledUpdatesReq !== undefined) {
    if (!Array.isArray(scheduledUpdatesReq)) {
      res.status(400).json({
        error: 'Scheduled updates must be a list.'
      });
      return;
    }

    const scheduledUpdates = scheduledUpdatesReq.map(date => !isNaN(new Date(date).getTime()));
    const scheduledUpdatesErr = scheduledUpdates.indexOf(false);
    if (scheduledUpdatesErr !== -1) {
      res.status(400).json({
        error: `Project deadline ${scheduledUpdatesReq[scheduledUpdatesErr]} must be valid dates.`
      });
      return;
    }
  }

  if (invitedUsersReq !== undefined) {
    if (!Array.isArray(invitedUsersReq)) {
      res.status(400).json({
        error: 'Invited users must be a list.'
      });
      return;
    }

    const invitedUsers = await Promise.all(invitedUsersReq.map(async (email) => {
      return UserCollection.findOneByEmail(email);
    }));
    const invitedUsersErr = invitedUsers.every(user => !!user);
    if (!invitedUsersErr) {
      res.status(404).json({
        error: 'Can only invite users with an existing account.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the current user is a member of the project whose projectId is in req.params
 */
const isValidProjectModifier = async (req: Request, res: Response, next: NextFunction) => {
  const project = await ProjectCollection.findOne(req.params.projectId);
  const userId = project.creatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' projects.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is invited to the project whose projectId is in req.params
 */
const isValidProjectInvitee = async (req: Request, res: Response, next: NextFunction) => {
  const project = await ProjectCollection.findOne(req.params.projectId);
  const invitedUsers = project.invitedUsers.map(user => user._id);
  if (invitedUsers.includes(req.session.userId)) {
    res.status(403).json({
      error: 'You do not have an invitation to this project'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is in the project with id in req.query
 * Or if updateId is given (needed so it doesn't flag GET /api/updates?updateId=updateId calls)
 */
 const isUserInProjectQueryOrUpdateId = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.updateId) {
    next();
    return;
  }
  
  const projectId = req.query.projectId as string;
  const project = await ProjectCollection.findOne(projectId);
  const userId = req.session.userId as string;
  const participants = project.participants.map((participant) => participant._id.toString());
  if (!participants.includes(userId)) {
    res.status(403).json({
      error: 'Cannot view updates for projects you are not in.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is in the project with id in req.body 
 */
 const isUserInProjectBody = async (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.body.projectId as string;
  const project = await ProjectCollection.findOne(projectId);
  const userId = req.session.userId as string;
  const participants = project.participants.map((participant) => participant._id.toString());
  if (!participants.includes(userId)) {
    res.status(403).json({
      error: 'Cannot view updates for projects you are not in.'
    });
    return;
  }

  next();
};

/**
 * Checks if the project with id in req.body is active
 */
 const isProjectActive = async (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.body.projectId as string;
  const project = await ProjectCollection.findOne(projectId);
  if (!project.active) {
    res.status(403).json({
      error: 'Cannot post updates to inactive projects.'
    });
    return;
  }

  next();
};

export {
  isValidProjectFields,
  isValidProjectFieldsEdit,
  isProjectExists,
  isProjectExistsQueryOrUpdateId,
  isProjectExistsBody,
  isValidProjectModifier,
  isValidProjectInvitee,
  isUserInProjectQueryOrUpdateId,
  isUserInProjectBody,
  isProjectActive,
};
