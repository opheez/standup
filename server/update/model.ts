import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
// import type {Project} from '../project/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Update on the backend
export type Update = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  dateModified: Date;
  status: string;
  summary: string;
  details: string;
  nextSteps: string[];
  tags: string[];
  projectId: Types.ObjectId;
};

// Type definition for Update on the backend
export type PopulatedUpdate = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: User;
  dateCreated: Date;
  dateModified: Date;
  status: string;
  summary: string;
  details: string;
  nextSteps: string[];
  tags: string[];
  projectId: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UpdateSchema = new Schema({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the update was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the update was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The status of the update
  status: {
    type: String,
    required: true
  },
  // The summary of the update
  summary: {
    type: String,
    required: true
  },
  // The details of the update
  details: {
    type: String,
    required: true
  },
  // The next steps of the update
  nextSteps: {
    type: [String],
    required: true
  },
  // The tags of the update
  tags: {
    type: [String],
    required: true
  },
  // The project the update is associated with
  projectId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const UpdateModel = model<Update>('Update', UpdateSchema);
export default UpdateModel;
