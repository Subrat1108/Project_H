import React, { Fragment } from 'react';
import loader from './loader.gif';

const Loader = () => (
  <Fragment>
    <img
      src={loader}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='loading'
    />
  </Fragment>
);

export default Loader;
