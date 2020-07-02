import axios from 'axios';
import {
  GET_POSTS,
  POST_ERROR,
  LIKE_DISLIKE_POST,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
} from './actionTypes';
import { setAlert } from '../actions/alertActions';

export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/v1/post/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const getAllPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/v1/post');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const likeDislikePost = ({ postId }) => async dispatch => {
  try {
    const res = await axios.put(`/api/v1/post/like/${postId}`);
    dispatch({
      type: LIKE_DISLIKE_POST,
      payload: { likes: res.data, id: postId },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/v1/post/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert('Post Deleted', 'success'));
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const addPost = text => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(`/api/v1/post/`, { text }, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post Created', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const addComment = ({ postId, text }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(
      `/api/v1/post/comment/${postId}`,
      { text },
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment Submitted', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const deleteComment = ({ postId, commentId }) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/v1/post/comment/${postId}/${commentId}`
    );
    dispatch({
      type: DELETE_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment Deleted', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
