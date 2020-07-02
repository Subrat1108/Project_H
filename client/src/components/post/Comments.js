import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteComment } from '../../actions/postActions';
import { connect } from 'react-redux';

const Comments = ({
  comment: { date, _id, text, name, avatar, user },
  auth,
  post,
  deleteComment,
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='D MMM YYYY'>{date}</Moment>
        </p>
        {!auth.loading && auth._id === user && (
          <Fragment>
            <button
              onClick={() =>
                deleteComment({ postId: post._id, commentId: _id })
              }
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-times'></i>
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
};

Comments.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

export default connect(null, { deleteComment })(Comments);
