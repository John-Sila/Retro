import { createStore } from "redux";

// reducer
const reducer = ( action = false, state ) => {
    console.log(state);
    switch (action) {
        case "LOGIN":
            return true;
        case "LOGOUT":
            return false;
    
        default:
            return false;
    }
}

// create the store
const store = createStore(reducer);

// listen for changes
store.subscribe( () => {
    console.log("Sign in satte changed to ", store.getState());
})

// export it
export default store;