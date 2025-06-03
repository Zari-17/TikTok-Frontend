"use client";
import classNames from "classnames";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { FaRegCompass, FaSignOutAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdOutlineAddBox } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import LinkWrapper from "../global/LinkWrapper";
import UploadVideoModal from "../modals/UploadVideoModal";
import { useUserContext } from "@/context/UserContext";
import { clientCookieManager } from "@/utils/cookie-manager";
import { cookies_keys } from "@/constants";
import { useRouter } from "next/router";

const navOptions = [
  {
    icon: <TiHome />,
    label: "Home",
    link: "/foryou",
  },
  {
    icon: <FaRegCompass />,
    label: "Explore",
    link: "/explore",
  },
];

const Options = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { user } = useUserContext();
  const router = useRouter();
  const activeTab = useMemo(
    () => navOptions.findIndex((option) => router.pathname.includes(option.link)),
    [router.pathname]
  );

  return (
    <>
      {navOptions?.map((option, index) => (
        <li key={index} className="flex items-center my-4">
          <Link
            href={option.link}
            className={classNames(`flex items-center my-1 duration-200`, {
              "text-primary": activeTab === index,
              "hover:scale-110 ": activeTab !== index,
            })}
          >
            <div className="text-[30px] mr-2">{option.icon}</div>
            <span className="ml-2  text-md font-medium">{option.label}</span>
          </Link>
        </li>
      ))}

      {user?.userRole === "CREATOR" && (
        <>
          <UploadVideoModal setOpen={setIsUploadOpen} isOpen={isUploadOpen} />
          <li
            className="flex items-center my-4 cursor-pointer"
            onClick={() => setIsUploadOpen(!isUploadOpen)}
          >
            <div className={classNames(`flex items-center my-1`)}>
              <div className="text-[30px] mr-2">
                <MdOutlineAddBox />
              </div>
              <span className="ml-2 text-md font-medium">Upload</span>
            </div>
          </li>
        </>
      )}

      {!!user && (
        <li className="flex items-center my-4">
          <LinkWrapper
            className={classNames(`flex items-center my-1 text-red-500 cursor-pointer hover:text-red-700`)}
            onClick={() => {
              clientCookieManager.delete(cookies_keys.USER_TOKEN);
              window.location.reload();
            }}
          >
            <div className="text-[30px] mr-2">
              <FaSignOutAlt />
            </div>
            <span className="ml-2  text-md font-medium">Log Out</span>
          </LinkWrapper>
        </li>
      )}
    </>
  );
};

export default Options;
