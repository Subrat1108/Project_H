import React from 'react';
import Moment from 'react-moment';

const ProfileEducation = ({ education }) => {
  return (
    <div>
      <h3>{education.school}</h3>
      <p>
        <Moment format='MMMM YYYY'>{education.from}</Moment>
        {' - '}
        {education.to === null ? (
          'Current'
        ) : (
          <Moment format='MMMM YYYY'>{education.to}</Moment>
        )}{' '}
      </p>
      <p>
        <strong>Degree: </strong>
        {education.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {education.fieldofstudy}
      </p>
      {education.description && (
        <p>
          <strong>Description: </strong>
          {education.description}
        </p>
      )}
    </div>
  );
};

export default ProfileEducation;
