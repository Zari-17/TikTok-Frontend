import Link from 'next/link';
import React from 'react';

type Props = {
  link?: string;
  children: React.ReactNode;
  [key: string]: any;
};

const LinkWrapper = ({ link, children, ...args }: Props) => {
  return link ? (
    <Link href={link} {...args}>
      {children}
    </Link>
  ) : (
    <div {...args}>{children}</div>
  );
};

export default LinkWrapper;
