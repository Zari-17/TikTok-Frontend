import React from "react";
import LinkWrapper from "./LinkWrapper";
import classNames from "classnames";

type Props = {
  sections?: {
    content: any;
    link?: string;
    onClick?: () => void;
    clickable?: boolean;
  }[][];
  isOpen?: boolean;
  className?: string;
};

const DropDown = ({ sections = [], isOpen, className }: Props) => {
  return (
    isOpen && (
      <div
        id=""
        className={classNames(
          "z-10  bg-background max-h-56 scrollbar-hide overflow-y-scroll divide-y divide-gray-1 rounded-lg shadow w-44 px-2 overflow-x-hidden right-0",
          className
        )}
      >
        {sections.map((section, index) => (
          <ul key={index} className="py-2 text-sm  ">
            {section.map((item, j) => (
              <li key={`${index}-${j}`}>
                <LinkWrapper
                  link={item.link}
                  onClick={item.onClick}
                  className={classNames(`cursor-pointer block  py-2`, {
                    "": item.clickable !== false,
                  })}
                >
                  {item.content}
                </LinkWrapper>
              </li>
            ))}
          </ul>
        ))}
      </div>
    )
  );
};

export default DropDown;
