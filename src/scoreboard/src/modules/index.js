import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import gameState from "./gameState";
import videoState from "./videoState";
import gameConfig from "./gameConfig";
import whoAmI from "./whoAmI";

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  gameState,
  videoState,
  gameConfig,
  whoAmI,
});

export default rootReducer;
