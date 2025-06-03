import {
  createComment,
  getComments,
  getResourceUrl,
  getUserToken,
  getVideRatings,
  likeVideoApi,
} from "@/utils/api-helpers";
import React, { JSX, useEffect, useState } from "react";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { FaArrowDown, FaArrowUp, FaHeart } from "react-icons/fa";
import CenterModal from "../global/CenterModal";
import { IoSend } from "react-icons/io5";
import useLoader from "@/hooks/useLoader";
import notify from "@/utils/notify";
import { useUserContext } from "@/context/UserContext";
import { getAuthHeader } from "@/utils/api";
import classNames from "classnames";
import { RxCross2 } from "react-icons/rx";

interface VideoProps {
  arrowUpPressed?: () => any;
  arrowDownPressed?: () => any;
  onClosePressed?: () => any;
  index: number;
  video: Video;
}

interface ButtonProps {
  onClick?: () => void;
  view?: JSX.Element;
  textView?: JSX.Element | any;
  className?: string;
}

const Button = ({ onClick, view, textView, className }: ButtonProps) => {
  return (
    <div
      className={classNames(
        "w-full flex items-center justify-center flex-col mb-2",
        className
      )}
    >
      <div
        onClick={onClick}
        className="text-xl aspect-square cursor-pointer hover:bg-opacity-45 w-full max-w-14 flex items-center justify-center rounded-full bg-app-gray-2"
      >
        {view}
      </div>
      <h1 className="text-sm font-semibold text-white opacity-60 ">
        {textView}
      </h1>
    </div>
  );
};

const Video = ({
  arrowDownPressed,
  arrowUpPressed,
  index,
  video,
  onClosePressed,
}: VideoProps) => {
  const url = getResourceUrl(video?.media?.url);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [info, setInfo] = useState<LikeComment | null>(null);

  useEffect(() => {
    getVideRatings(video.id).then((res) => {
      setInfo(res);
    });
  }, []);

  const [likeLoading, setLikeLoading] = useState(false);

  const likeVideo = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const isLiked = info?.isLikedByYou || false;

    if (!getUserToken()) {
      notify.error("You need to login to like the video");
      return;
    }

    const like = !isLiked;

    const res = await likeVideoApi(video.id, like);

    if (res.success && info) {
      setInfo({
        ...info,
        likes: res.liked ? info.likes + 1 : info.likes - 1,
        isLikedByYou: res.liked,
      });
    }

    setLikeLoading(false);
  };

  return (
    <>
      <CommentModal
        video={video}
        isOpen={commentsOpen}
        setOpen={setCommentsOpen}
      />
      <div
        id={`video-${index}`}
        style={{
          scrollSnapAlign: "start",
        }}
        className="h-screen w-full justify-center flex items-center"
      >
        <div className="h-full flex-1 gap-2  flex flex-col items-center justify-end pb-5"></div>
        <div className="relative  h-screen aspect-[9/16] p-1">
          <video
            loop
            autoPlay
            muted
            controls
            className="w-full h-full object-cover rounded-2xl"
            src={url}
          />
          <div className="z-10 bg-black bg-opacity-60 absolute py-2 pb-4  bottom-0 max-h-[150px] w-[calc(100%-8px)] rounded-b-2xl p-2 ">
            <h1 className="font-bold">@{video.user.username}</h1>
            <p className="font-medium text-sm mb-1">{video.title}</p>
            <p className="text-gray-300 text-xs">{video.description}</p>
            <p>
              {video?.videoTags?.map((tag, index) => `#${tag.tag}`).join(" ")}
            </p>
          </div>
        </div>
        <div className="h-full flex-1 gap-2  flex flex-col items-center justify-end pb-5">
          {onClosePressed && (
            <Button
              className="mb-auto mt-5"
              onClick={onClosePressed}
              view={<RxCross2 className={""} />}
            />
          )}
          <Button
            onClick={likeVideo}
            textView={info ? info.likes.toString() : ""}
            view={
              <FaHeart
                className={classNames({
                  "text-red-500": info?.isLikedByYou,
                })}
              />
            }
          />
          <Button
            onClick={() => {
              setCommentsOpen(true);
            }}
            textView={info ? info.comments.toString() : ""}
            view={<BiSolidMessageRoundedDots />}
          />
          {index !== 0 && arrowUpPressed && (
            <Button onClick={arrowUpPressed} view={<FaArrowUp />} />
          )}
          {arrowDownPressed && (
            <Button onClick={arrowDownPressed} view={<FaArrowDown />} />
          )}
        </div>
      </div>
    </>
  );
};

interface Comment {
  user: User;
  text: string;
}

const CommentModal = ({
  video,
  isOpen,
  setOpen,
}: {
  video: Video;
  isOpen: boolean;
  setOpen: any;
}) => {
  const { user } = useUserContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setComments([]);
      getComments(video.id, 1, 100).then((comments) => {
        console.log("comments :-> ", comments);
        setLoading(false);
        setComments(comments as any);
      });
    }
  }, [isOpen]);

  const { loading: notifyLoader, setLoading: setNotifyLoader } = useLoader();

  const sendComment = () => {
    if (notifyLoader) return;
    if (type.length === 0) {
      notify.error("Comment cannot be empty");
      return;
    }

    setNotifyLoader("Sending comment...");

    createComment(video.id, type).then((res) => {
      setNotifyLoader("");
      if (res.success) {
        notify.success("Comment added successfully");
        setType("");
        setComments((p) => [
          {
            ...res.data.data,
            user,
          } as any,
          ...p,
        ]);
      }
    });
  };

  return (
    <CenterModal isOpen={isOpen} setOpen={setOpen}>
      <div className="bg-app-gray-2 p-3 rounded-md  w-[90vw] sm:w-[70vw] md:w-[50vw] ">
        <h1 className="text-xl mb-2">Comments</h1>
        {loading && (
          <h1 className="text-sm text-white opacity-60">Loading...</h1>
        )}

        <div className="w-full flex mb-4">
          <input
            className="w-full p-2 bg-app-gray placeholder-gray-400  rounded-md"
            placeholder="Type your comment here..."
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <button
            className="bg-primary p-2 rounded-md ml-2 px-5"
            onClick={sendComment}
          >
            <IoSend />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <div>
            {!loading && comments.length === 0 && (
              <h1 className="text-sm text-white opacity-60">No comments yet</h1>
            )}
            {comments.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-app-gray-1 rounded-md"
              >
                <div className="bg-app-gray w-full p-2 rounded-md mb-2">
                  <h2 className="text-sm font-semibold text-white">
                    @{item?.user?.username}
                  </h2>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CenterModal>
  );
};

export default Video;
