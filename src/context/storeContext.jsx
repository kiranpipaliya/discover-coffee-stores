import { createContext, useReducer } from 'react';

export const StoreContext = createContext();

export const ACTION_TYPE = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORE: 'SET_COFFEE_STORE',
};

const storeReducer = (state, action) => {
  if (action.type === ACTION_TYPE.SET_LAT_LONG) {
    return { ...state, lat: action.payload.lat, long: action.payload.long };
  }

  if (action.type === ACTION_TYPE.SET_COFFEE_STORE) {
    return { ...state, coffeeStore: action.payload.coffeeStore };
  }
  throw new Error('Unknown action type');
};

export const StoreProvider = ({ children }) => {
  const intialStore = { lat: '', long: '', coffeeStore: [] };

  const [state, dispatch] = useReducer(storeReducer, intialStore);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
