import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileItem = ({ profile }) => {
  const skills = profile.skills.slice(0, 4).map((skill, index) => (
    <li key={index} className='text-primary'>
      <i className='fas fa-check'></i> {skill}
    </li>
  ));
  return (
    <Fragment>
      <div className='profile bg-light'>
        <img className='round-img' src={profile.user.avatar} alt='' />
        <div>
          <h2>{profile.user.name}</h2>
          <p>
            {profile.status}{' '}
            {profile.company && <span> at {profile.company}</span>}
          </p>
          <p className='my-1'>
            {profile.location && <span>{profile.location}</span>}
          </p>
          <Link to={`/profile/${profile.user._id}`} className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <ul>{skills}</ul>
      </div>
    </Fragment>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
export default ProfileItem;
