import Loader from "@/components/global/Loader";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const notify = {
  success: (message: string) => {
    toast.custom(
      (t: any) => (
        <div
          className={`${
            t.visible ? "scale-100  opacity-100" : "scale-0 opacity-0"
          } max-w-md w-fit duration-500 gap-5  bg-gray-900 my-container shadow-lg items-center p-2 pr-3 flex`}
        >
          {t.visible && <FaCheck />}

          {t.visible && (
            <div
              style={{
                marginLeft: 10,
              }}
              className=""
            >
              {message}
            </div>
          )}
        </div>
      ),
      {
        duration: 2000,
      }
    );
  },

  error: (message: string) => {
    toast.custom(
      (t: any) => (
        <div
          className={`${
            t.visible ? "scale-100  opacity-100" : "scale-0 opacity-0"
          } max-w-md w-fit duration-500 gap-5  bg-gray-900 my-container shadow-lg items-center p-2 pr-3 flex`}
        >
          {t.visible && <RxCross2 />}

          {t.visible && (
            <div
              style={{
                marginLeft: 10,
              }}
              className=""
            >
              {message}
            </div>
          )}
        </div>
      ),
      {
        duration: 2000,
      }
    );
  },

  loading: (message: string) => {
    return toast.custom(
      (t: any) => (
        <div
          className={`${
            t.visible ? "scale-100  opacity-100" : "scale-0 opacity-0"
          } max-w-md w-fit duration-500 gap-5  bg-gray-900 my-container shadow-lg items-center p-2 pr-3 flex`}
        >
          {t.visible && <Loader />}

          {t.visible && (
            <div
              style={{
                marginLeft: 10,
              }}
              className=""
            >
              {message}
            </div>
          )}
        </div>
      ),
      {
        duration: 10000,
      }
    );
  },
};

export default notify;
