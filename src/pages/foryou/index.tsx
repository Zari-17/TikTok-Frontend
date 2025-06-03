"use client";
import Video from "@/components/app/Video";
import AppLayout from "@/components/layout/AppLayout";
import { cookies_keys } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import { getUser, getVideos } from "@/utils/api-helpers";
import { serverCookieManager } from "@/utils/cookie-manager";
import { NextPageContext } from "next";
import React, { useEffect } from "react";

interface Props {
  user: User | null;
}

const ForYouPage = ({ user }: Props) => {
  useUserContext().setUser(user);

  const [videos, setVideos] = React.useState<any[]>([]);

  useEffect(() => {
    getVideos(1, 20).then((res) => {
      setVideos(res);
    });
  }, []);

  const setInView = (index: number) => {
    const element = document.querySelector(`#video-${index}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      style={{
        scrollSnapType: "y mandatory",
        overflowY: "scroll",
      }}
      className="w-full flex flex-col items-center h-screen scrollbar-hide"
    >
      {videos.map((v, i) => (
        <Video
          video={v}
          index={i}
          arrowDownPressed={() => {
            setInView(i + 1);
          }}
          arrowUpPressed={() => {
            setInView(i - 1);
          }}
          key={i}
        />
      ))}
    </div>
  );
};

export default ForYouPage;
ForYouPage.Layout = AppLayout;

export const getServerSideProps = async (context: NextPageContext) => {
  const token = await serverCookieManager(context).get(cookies_keys.USER_TOKEN);
  const user = await getUser(token || "");

  return {
    props: {
      user,
    },
  };
};
