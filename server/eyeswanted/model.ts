import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Update} from '../update/model';

/**
 * This file defines the properties stored in a EyesWanted
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for EyesWanted on the backend
export type EyesWanted = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  targetUsers: Types.ObjectId[];
  updateId: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedEyesWanted = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  targetusers: User[];
  updateId: Update;
  dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// EyesWanted stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EyesWantedSchema = new Schema<EyesWanted>({
  // The users who read the EyesWanted
  targetUsers: [{
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // The update for the EyesWanted
  updateId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Update'
  },
  // The date the EyesWanted was created
  dateCreated: {
    type: Date,
    required: true,
  }
});

const EyesWantedModel = model<EyesWanted>('EyesWanted', EyesWantedSchema);
export default EyesWantedModel;
