import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PostTop = ({ post: { user, avatar, name, text } }) => {
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
      </div>
    </div>
  );
};

PostTop.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostTop;
