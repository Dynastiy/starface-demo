import reels from './reels';
import appImages from './appImages';
import auth from './auth';
import chat from './chat';
import userActivity from './userActivity';
import wallet from './wallet';
import feeds from './feeds';

export const services = {
  reels,
  appImages,
  auth,
  chat,
  userActivity,
  wallet,
  feeds
};

// Optionally, if you want to access all services via a single object
export default services;