export const initialState = {
    order: [],
    user: null,
    bar: null
};

const reducer = (state: any, action: any) => {

    switch (
        action.type //mutable updates
    ) {
        case "SET_BAR":
            console.log(action)
            return {
                ...state,
                bar: action.bar,
            };

        default:
            return state;
    }
};

export default reducer;
