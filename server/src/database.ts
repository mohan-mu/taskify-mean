import { Task } from './tasks';
import { connect } from 'mongoose';

//TODO: Fix
// Connect to MongoDB

export async function connectToDatabase(
  uri: string,
  config: { db: string; collection: string }
) {
  return connect(`${uri}/${config.db}`);
}
