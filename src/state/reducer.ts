import AsyncStorage from "@react-native-async-storage/async-storage";

export const initialState = {
  order: [],
  user: null,
  bar: null,
  completed: [],
  inprogress: [],
};


const storeBar = async (value : any) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem("bar", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getBar = async (state : any) => {
  try {
    const jsonValue = await AsyncStorage.getItem("bar");

    if (jsonValue !== null) {
      return {
        ...state,
        bar: JSON.parse(jsonValue),
      };
    } else {
        console.log("bar not found")
        return null
    }
  } catch (e) {
    // error reading value
  }
};

const reducer = (state: any, action: any) => {
  switch (
    action.type //mutable updates
  ) {
    case "SET_BAR":
      console.log(action);
      storeBar(action.bar)
      return {
        ...state,
        bar: action.bar,
      };

    case "ADD_TO_IN_PROGRESS":
      //Logic for order
      return {
        ...state,
        order: [...state.order, action.item],
      };

    case "ADD_TO_COMPLETED":
      //Logic for order
      return {
        ...state,
        order: [...state.order, action.item],
      };
    case "LOAD_BAR":
      return getBar(state);
    default:
      return state;
  }
};

export default reducer;
