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
 * Checks if the content of the project in req.body is valid, i.e. project name is non-empty and < 50 char, dates and users are valid values
 */
const isValidProjectFields = async (req: Request, res: Response, next: NextFunction) => {
  const {projectName, scheduledUpdatesReq, invitedUsersReq} = req.body as {projectName: string, scheduledUpdatesReq: any[], invitedUsersReq: string[]};

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

  const scheduledUpdates = scheduledUpdatesReq.map(date => !isNaN(new Date(date).getTime()));
  const scheduledUpdatesErr = scheduledUpdates.indexOf(false);
  if (scheduledUpdatesErr !== -1) {
    res.status(400).json({
      error: `Project deadline ${scheduledUpdatesReq[scheduledUpdatesErr]} must be valid dates.`
    });
    return;
  }

  const invitedUsers = await Promise.all(invitedUsersReq.map(async (user) => {
    const validFormat = Types.ObjectId.isValid(user);
    return validFormat ? await ProjectCollection.findOne(req.params.projectId) : '';
  }));
  const invitedUsersErr = invitedUsers.indexOf('');
  if (invitedUsersErr !== -1) {
    res.status(404).json({
      error: `Invited user ${invitedUsers[invitedUsersErr]} must be valid user ID`
    });
    return;
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

export {
  isValidProjectFields,
  isProjectExists,
  isValidProjectModifier,
  isValidProjectInvitee
};
