import { createStore } from 'redux';

const reducerFn = (state = { location: null, requiredSeat: null}, action) => {
    switch (action.type) {
        case 'location':
            return {...state, location: action.payload}
        case 'requiredSeat':
            return {...state, requiredSeat: action.payload}
        case 'info':
            return {...state, info: action.payload}
        case 'uid':
            return {...state, uid: action.payload}
        case 'origin':
            return {...state, origin: action.payload}
        case 'destination':
            return {...state, destination: action.payload}
        case 'name':
            return {...state, name: action.payload}
        case 'phone':
            return {...state, phone: action.payload}
        case 'token':
        return {...state, token: action.payload}
    }
    return state;
}

const store = createStore(reducerFn);
export default store;