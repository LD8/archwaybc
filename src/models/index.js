// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Video, Image } = initSchema(schema);

export {
  Video,
  Image
};