export const initialState = null;


export const reducer = (state, action) => {
    console.log('heree');
    if(action.type == "USER") {
        console.log(action.payload, 'payload');
        return action.payload
    }
    if(action.type == "CLEAR") {
        return null;
    }
    if(action.type == 'UPDATE') {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }if(action.type=="UPDATEPIC") {
        return {
            ...state,
            pic: action.payload
        }
    }
    return state;
}