import { combineReducers } from 'redux';
// import routes from './routes';
import user from './user';
import wines from './wines';
import wine from './wine';
import cellars from './cellars';
import cellar from './cellar';
import search from './search';
import results from './results';

export default combineReducers({
  // routes,
  wine,
  user,
  wines,
  cellars,
  cellar,
  search,
  results
  // medications,
  // treatPictures,
  // notifications
});
