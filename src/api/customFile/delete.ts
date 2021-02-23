import { api } from '..';
import { PrimaryKey } from '@directus/sdk-js/dist/types/types';
import { COLLECTION } from './utils';

const METHOD = 'customFileDelete()';

export async function customFileDeleteByDirectus(key: PrimaryKey) {
  try {
    await api.directus.items(COLLECTION).delete(key);
    console.warn(METHOD, '- key:', key);
    return true;
  } catch (error) {
    console.error(METHOD, error);
  }
  return false;
}

export default customFileDeleteByDirectus;
