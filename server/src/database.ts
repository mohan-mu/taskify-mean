import { connect } from 'mongoose';

export async function connectToDatabase(
  uri: string,
  config: { db: string; collection: string }
) {
  return connect(`${uri}/${config.db}`);
}
