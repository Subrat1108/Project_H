import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/postActions';
import Loader from '../layout/Loader';
import PostTop from './PostTop';
import PostCommentForm from './PostCommentForm';
import Comments from './Comments';

const Post = ({ post, getPost, match, loading, auth }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  return (
    <Fragment>
      {post === null || loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Link to='/posts' className='btn'>
            Back To Posts
          </Link>
          <PostTop post={post} />
          <PostCommentForm post={post} />
          <div className='comments'>
            {post.comments === null || post.comments.length === 0 ? (
              <h4>No Comments Yet</h4>
            ) : (
              <Fragment>
                {post.comments.map(comment => (
                  <Comments
                    key={comment._id}
                    comment={comment}
                    auth={auth}
                    post={post}
                  />
                ))}
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.postReducer.post,
  loading: state.postReducer.loading,
  auth: state.authReducer,
});

export default connect(mapStateToProps, { getPost })(Post);
