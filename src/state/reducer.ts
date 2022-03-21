export const initialState = {
    order: [],
    user: null,
    bar: null,
    completed: [],
    inprogress: []
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

        default:
            return state;
    }
};

export default reducer;
