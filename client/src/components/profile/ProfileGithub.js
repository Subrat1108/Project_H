import React, { useEffect, Fragment } from 'react';
import Loader from '../layout/Loader';
import { getGithubRepos } from '../../actions/profileActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProfileGithub = ({ username, getGithubRepos, repos, loading }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <i className='fab fa-github'></i> Github Repos
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {repos === null || (repos && repos.length === 0) ? (
            <h4>No Github Repositories Found</h4>
          ) : (
            <Fragment>
              {repos.map(repo => (
                <div key={repo.id} className='repo bg-white p-1 my-1'>
                  <div>
                    <h4>
                      <a
                        href={repo.html_url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {repo.name}
                      </a>
                    </h4>
                    {repo.description && <p>{repo.description}</p>}
                  </div>
                  <div>
                    <ul>
                      <li className='badge badge-primary'>
                        Stars: {repo.stargazers_count}
                      </li>
                      <li className='badge badge-dark'>
                        Watchers: {repo.watchers}
                      </li>
                      <li className='badge badge-light'>Forks: {repo.forks}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  repos: state.profileReducer.repos,
  loading: state.profileReducer.loading,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
