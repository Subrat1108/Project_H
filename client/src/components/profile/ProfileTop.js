import React from 'react';

const ProfileTop = ({
  user: { avatar, name },
  social,
  company,
  location,
  status,
  website,
}) => {
  return (
    <div className='profile-top bg-primary p-2'>
      <img className='round-img my-1' src={avatar} alt='' />
      <h1 className='large'>{name}</h1>
      <p className='lead'>
        {status} {company && <span>at {company}</span>}
      </p>
      {location && <p>{location}</p>}
      <div className='icons my-1'>
        {website && (
          <a href={website} target='_blank' rel='noopener noreferrer'>
            <i className='fas fa-globe fa-2x'></i>
          </a>
        )}
        {social &&
          Object.entries(social).map((item, index) => (
            <a
              key={index}
              href={item[1]}
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className={`fab fa-${item[0]} fa-2x`}></i>
            </a>
          ))}
      </div>
    </div>
  );
};

export default ProfileTop;
