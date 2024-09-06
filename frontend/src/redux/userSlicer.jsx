import {createSlice} from '@reduxjs/toolkit';

let userSlicer = createSlice({
    name:'user',
    initialState:{
        authUser:null
    },
    reducers:{
        setAuthUser:(state, action) =>{
            state.authUser = action?.payload
        }
    }
})

export default userSlicer.reducer
export let {setAuthUser} = userSlicer.actions