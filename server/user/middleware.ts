import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if both first and last names in req.body is valid, that is, it matches the name regex
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  if ([req.body.firstName, req.body.lastName].includes(undefined)) {
    res.status(400).json({
      error: 'Both firstName and lastName must be defined.'
    });
    return;
  }

  const nameRegex = /^\w+$/i;
  if (!nameRegex.test(req.body.firstName) || !nameRegex.test(req.body.lastName)) {
    res.status(400).json({
      error: 'Names must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if last name in req.body is valid, that is, it matches the name regex
 */
 const isValidOrUndefinedFirstName = (req: Request, res: Response, next: NextFunction) => {
  // if undefined, no change
  if (!req.body.firstName) {
    next();
    return;
  }

  const nameRegex = /^\w+$/i;
  if (!nameRegex.test(req.body.firstName)) {
    res.status(400).json({
      error: 'First name must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if first name in req.body is valid, that is, it matches the name regex
 */
 const isValidOrUndefinedLastName = (req: Request, res: Response, next: NextFunction) => {
  // if both undefined, no change
  if (!req.body.lastName) {
    next();
    return;
  }

  const nameRegex = /^\w+$/i;
  if (!nameRegex.test(req.body.lastName)) {
    res.status(400).json({
      error: 'Last name must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if an email in req.body is valid, that is, it matches the email regex
 */
const isValidEmail = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email === undefined) {
    res.status(400).json({
      error: 'Email cannot be undefined.'
    });
    return;
  }

  const emailRegex = /^^\S+@.+\..+$/i;
  if (!emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: 'Email must be of the format someone@somewhere.domain.'
    });
    return;
  }

  next();
};

/**
 * Checks if an email in req.body is undefined, or valid, that is, it matches the email regex
 */
 const isValidOrUndefinedEmail = (req: Request, res: Response, next: NextFunction) => {
  // if undefined, no change
  if (!req.body.email) {
    next();
    return;
  }

  const emailRegex = /^^\S+@.+\..+$/i;
  if (!emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: 'Email must be of the format someone@somewhere.domain.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.password === undefined) {
    res.status(400).json({
      error: 'Password cannot be undefined.'
    });
    return;
  }

  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is undefined, or valid, that is, at 6-50 characters long without any spaces
 */
 const isValidOrUndefinedPassword = (req: Request, res: Response, next: NextFunction) => {
  // if undefined, no change
  if (!req.body.password) {
    next();
    return;
  }

  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body as {email: string; password: string};

  if (!email || !password) {
    res.status(400).json({error: `Missing ${email ? 'password' : 'username'} credentials for sign in.`});
    return;
  }

  const user = await UserCollection.findOneByEmailAndPassword(
    email, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid user login credentials provided.'});
  }
};

/**
 * Checks if an email in req.body is already in use
 */
const isEmailNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email !== undefined) { // If email is not being changed, skip this check
    const user = await UserCollection.findOneByEmail(req.body.email);

    // If the current session user wants to change their email to one which matches
    // the current one irrespective of the case, we should allow them to do so
    if (user && (user?._id.toString() !== req.session.userId)) {
      res.status(409).json({
        error: 'An account with this email already exists.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isEmailNotAlreadyInUse,
  isAccountExists,
  isValidEmail,
  isValidOrUndefinedEmail,
  isValidPassword,
  isValidOrUndefinedPassword,
  isValidName,
  isValidOrUndefinedFirstName,
  isValidOrUndefinedLastName,
};
