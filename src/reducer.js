export default (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                joined: true,
                userName: action.payload.userName,
                roomId: action.payload.roomId,
            };

        case 'EXIT':
            return {
                ...state,
                joined: false,
            };


        case 'SET_DATA':
            return {
                ...state,
                messages: action.payload,
            };

        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            };

        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload,
            };

        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        default:
            return state;
    }
}
