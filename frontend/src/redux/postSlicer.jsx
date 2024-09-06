import {createSlice} from '@reduxjs/toolkit';

let postSlicer = createSlice({
    name:"post",
    initialState:{
        posts:[],
        selectedPost:[]
    },
    reducers:{
        setPost:(state, action)=>{
            state.posts = action?.payload
        },
        setSelectedPost:(state, action) =>{
            state.selectedPost = action?.payload
        }
       
    }
    
})

export default postSlicer.reducer
export let {setPost, setSelectedPost} = postSlicer.actions