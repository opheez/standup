import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Update} from '../update/model';

/**
 * This file defines the properties stored in a Thanks
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for EyesWanted on the backend
export type Thanks = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  postUser: Types.ObjectId[];
  updateId: Types.ObjectId;
};

export type PopulatedThanks = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  postUser: User[];
  updateId: Update;
};

// Mongoose schema definition for interfacing with a MongoDB table
// EyesWanted stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ThanksSchema = new Schema<Thanks>({
  // The users who posted the thanks (thank the other user)
  postUser: [{
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
});

const ThanksModel = model<Thanks>('Thanks', ThanksSchema);
export default ThanksModel;
