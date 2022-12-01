import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Project
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Project on the backend
export type Project = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: Types.ObjectId;
  active: boolean;
  projectName: string;
  scheduledUpdates: Date[]; 
};

export type PopulatedProject = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: User;
  active: boolean;
  projectName: string;
  participants: Types.ObjectId[];
  invitedUsers: Types.ObjectId[];
  scheduledUpdates: Date[]; 
};

// Mongoose schema definition for interfacing with a MongoDB table
// Projects stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProjectSchema = new Schema<Project>({
  // The author userId
  creatorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Whether or not the project is active
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  // The name of the project
  projectName: {
    type: String,
    required: true
  },
  // Dates requiring updates, if exists
  scheduledUpdates: {
    type: [Date],
    required: false
  }
}, {
  toObject: {virtuals: true, versionKey: false},
  toJSON: {virtuals: true, versionKey: false}
});

// Virtual fields to populate

// ProjectSchema.virtual('intent', {
//   ref: 'Intent',
//   localField: '_id',
//   foreignField: 'freetId'
// })

const ProjectModel = model<Project>('Project', ProjectSchema);
export default ProjectModel;
