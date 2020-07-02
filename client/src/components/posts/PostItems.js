import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { likeDislikePost, deletePost } from '../../actions/postActions';
import { connect } from 'react-redux';

const PostItems = ({ post, auth, likeDislikePost, deletePost }) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${post.user}`}>
          <img className='round-img' src={post.avatar} alt='' />
          <h4>{post.name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{post.text}</p>
        <p className='post-date'>
          Posted on {<Moment format='DD/MM/YYYY'>{post.date}</Moment>}
        </p>
        <button
          onClick={() => likeDislikePost({ postId: post._id })}
          type='button'
          className='btn btn-light'
        >
          <i className='fas fa-thumbs-up'></i>
          <span> {post.likes.length}</span>
        </button>
        <Link to={`/post/${post._id}`} className='btn btn-primary'>
          Discussion{' '}
          <span className='comment-count'>{post.comments.length}</span>
        </Link>
        {!auth.loading && post.user === auth._id && (
          <button
            onClick={() => deletePost(post._id)}
            type='button'
            className='btn btn-danger'
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostItems.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  likeDislikePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { likeDislikePost, deletePost })(
  PostItems
);
