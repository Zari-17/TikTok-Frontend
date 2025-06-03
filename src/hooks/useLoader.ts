import notify from "@/utils/notify";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useLoader = () => {
  const [loading, setLoading] = useState("");
  const [toastId, setToastId] = useState("");

  useEffect(() => {
    if (loading) {
      setToastId(notify.loading(loading));
    } else {
      toast.dismiss(toastId);
    }
  }, [loading]);

  return { loading, setLoading };
};

export default useLoader;
