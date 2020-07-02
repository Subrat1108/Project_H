import React from 'react';
import Moment from 'react-moment';

const ProfileExperience = ({ experience }) => {
  return (
    <div>
      {experience.company && (
        <h3 className='text-dark'>{experience.company}</h3>
      )}
      <p>
        <Moment format='MMMM YYYY'>{experience.from}</Moment>
        {' - '}
        {experience.to === null ? (
          'Current'
        ) : (
          <Moment format='MMMM YYYY'>{experience.to}</Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {experience.title}
      </p>
      {experience.description && (
        <p>
          <strong>Description: </strong>
          {experience.description}
        </p>
      )}
    </div>
  );
};

export default ProfileExperience;
