import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllPosts } from '../../actions/postActions';
import Loader from '../layout/Loader';
import PropTypes from 'prop-types';
import PostItems from './PostItems';
import PostForm from './PostForm';

const Posts = ({ getAllPosts, posts, loading }) => {
  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Posts</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome to the community!
          </p>

          <PostForm />

          <div className='posts'>
            {posts.map(post => (
              <PostItems key={post._id} post={post} />
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getAllPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  posts: state.postReducer.posts,
  loading: state.postReducer.loading,
});

export default connect(mapStateToProps, { getAllPosts })(Posts);
