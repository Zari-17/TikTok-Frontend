import classNames from 'classnames';
import React from 'react';
import { RiLoader3Fill } from 'react-icons/ri';

const Loader = ({ className = 'text-3xl' }: { className?: string }) => {
  return <RiLoader3Fill className={classNames('animate-spin', className)} />;
};

export default Loader;
