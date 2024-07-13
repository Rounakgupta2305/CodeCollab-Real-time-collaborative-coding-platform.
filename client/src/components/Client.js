import React from 'react';
import Avatar from 'react-avatar';

function Client({username}) {

  return (
    <div className="d-flex align-items-center my-3">
      <Avatar name={username.toString()} size={50} round="14px" className="mr-3" />
      <span className='my-2'>{username.toString()}</span>
    </div>
  );
}

export default Client;
