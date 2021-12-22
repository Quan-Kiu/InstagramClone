import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
const { getData } = authApi;

const initialState = {
    postHome: {
        posts: [],
        page: 1,
    },
    postsExplore: [],
    postUser: {
        total: 0,
        default: {
            user: '',
            get: false,
            data: [],
        },
        saved: {
            user: '',
            get: false,
            data: [],
        },
        tagged: {
            user: '',
            get: false,
            data: [],
        },
    },
    postDetail: null,
    success: '',
    error: '',
    loading: false,
};

export const getPosts = createAsyncThunk(
    'posts/',

    async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
        try {
            const res = await getData(
                `posts?page=${params.page}&limit=${params.limit}`
            );

            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getPostsExplore = createAsyncThunk(
    'posts/getPostsExplore',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`posts/getPostsExplore`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getPostsByUser = createAsyncThunk(
    'posts/getByUser/:id',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`posts/getByUser/${params}`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getPostById = createAsyncThunk(
    'post/:id',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`post/${params}`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getPostsSavedByUser = createAsyncThunk(
    'posts/getSavedByUser/:id',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`posts/getSavedByUser/${params}`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const createPost = createAsyncThunk(
    'posts/create',
    async (params, { rejectWithValue }) => {
        try {
            const res = await authApi.postData('posts/create', params);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const likePost = createAsyncThunk(
    'post/:id/like',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const res = await authApi.patchData(`post/${params}/like`);

            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const unlikePost = createAsyncThunk(
    'post/:id/unlike',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const res = await authApi.patchData(`post/${params}/unlike`);

            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const savePost = createAsyncThunk(
    'post/:id/save',
    async (params, { rejectWithValue }) => {
        try {
            const res = await authApi.patchData(`post/${params}/save`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const unsavePost = createAsyncThunk(
    'post/:id/save',
    async (params, { rejectWithValue }) => {
        try {
            const res = await authApi.patchData(`post/${params}/unsave`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const commnentPost = createAsyncThunk(
    'comment/create',
    async (params, { rejectWithValue }) => {
        try {
            const res = await authApi.postData('comment/create', {
                comment: params,
            });
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const deletePost = createAsyncThunk(
    'post/:id/delete',
    async (params, { rejectWithValue }) => {
        try {
            const res = await authApi.deleteData(`post/${params}/delete`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const postSlice = createSlice({
    name: 'postReducer',
    initialState,
    reducers: {
        handleSuccess: (state) => {
            state.success = '';
        },
        handleFailed: (state) => {
            state.error = '';
        },
        updatePagePostHome: (state) => {
            state.postHome.page += 1;
        },
        updateDetailPost: (state, action) => {
            state.postDetail = action.payload;
        },
        updatePostUser: (state, action) => {
            state.postUser = action.payload;
        },
        updatePost: (state, action) => {
            const index = state.postHome.posts.findIndex(
                (post) => post._id === action.payload._id
            );
            if (index >= 0) {
                state.postHome.posts.splice(index, 1, action.payload);
            }
        },
        removePost: (state, action) => {
            const index = state.postHome.posts.findIndex(
                (post) => post._id === action.payload._id
            );
            if (index >= 0) {
                state.postHome.posts.splice(index, 1);
            }
        },

        resetPostUser: (state, action) => {
            state.postUser[action.payload] = {
                user: '',
                get: false,
                data: [],
            };
        },
    },
    extraReducers: {
        [getPosts.pending]: (state) => {
            state.loading = true;
        },
        [getPosts.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getPosts.fulfilled]: (state, action) => {
            state.loading = false;
            state.postHome.posts = [
                ...state.postHome.posts,
                ...action.payload.posts,
            ];
        },

        [commnentPost.fulfilled]: (state, action) => {
            const index = state.postHome.posts.findIndex(
                (post) => post._id === action.payload.post._id
            );

            if (index >= 0) {
                state.postHome.posts.splice(index, 1, action.payload.post);
            }
        },

        [createPost.pending]: (state) => {
            state.loading = true;
        },
        [createPost.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [createPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = action.payload.message;
        },

        [deletePost.fulfilled]: (state, action) => {
            const index = state.postHome.posts.findIndex(
                (post) => post._id === action.payload.post._id
            );
            if (index >= 0) {
                state.postHome.posts.splice(index, 1);
            }
        },

        [getPostsByUser.pending]: (state) => {
            state.loading = true;
        },
        [getPostsByUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getPostsByUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.postUser.default.get = true;
            state.postUser.total = action.payload.total;
            state.postUser.default.data = action.payload.posts;
            state.postUser.default.user = action.payload.user;
        },
        [getPostsExplore.fulfilled]: (state, action) => {
            state.postsExplore = action.payload.posts;
        },

        [getPostById.pending]: (state) => {
            state.loading = true;
        },
        [getPostById.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getPostById.fulfilled]: (state, action) => {
            state.loading = false;
            state.postDetail = action.payload.post;
        },
        [getPostsSavedByUser.pending]: (state) => {
            state.loading = true;
        },
        [getPostsSavedByUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getPostsSavedByUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.postUser.saved.get = true;
            state.postUser.saved.user = action.payload.user;
            state.postUser.saved.data = action.payload.posts;
        },
    },
});

const { reducer, actions } = postSlice;

export const {
    handleFailed,
    handleSuccess,
    updateDetailPost,
    updatePost,
    removePost,
    updatePostUser,
    updatePagePostHome,
    resetPostUser,
} = actions;

export default reducer;
