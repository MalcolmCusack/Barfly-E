
export const initialState = {
    user: null,
    order: []
};


// This goes through all the items in the basket and adds them up starting from 0
// reduces the array to one value

const reducer = (state: any, action: any) => {
    //console.log(action);

    switch (
        action.type //mutable updates
    ) {
        case "FETCH_USER_DATA_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case "FETCH_USER_DATA_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                user: action.payload.user,
            };

        case "FETCH_USER_DATA_FAILURE":
            return { ...state, isLoading: false, isError: true };

        case "RESET_USER_DATA":
            return { ...state, user: null };


        default:
            return state;
    }
};

export default reducer;
