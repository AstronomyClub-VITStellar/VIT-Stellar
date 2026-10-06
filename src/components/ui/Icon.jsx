import React from 'react';

function Icon({ name, className = "" }) {
  return <span className={"material-icons-round " + className} aria-hidden="true">{name}</span>;
}

export default Icon;
