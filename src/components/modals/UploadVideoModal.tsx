"use client";
import React, { useEffect, useState } from "react";
import CenterModal from "../global/CenterModal";
import { Formik } from "formik";
import InputField from "../global/InputField";
import MultiSelectInput from "../global/MultiSelectInput";
import { getUserToken, getVideoTags, uploadVideo } from "@/utils/api-helpers";
import useLoader from "@/hooks/useLoader";
import notify from "@/utils/notify";
import api, { endPoints, getAuthHeader } from "@/utils/api";
import { useRouter } from "next/router";

interface Props {
  isOpen: boolean;
  setOpen: any;
}

const UploadVideoModal = ({ isOpen, setOpen }: Props) => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [tags, setTags] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    getVideoTags()?.then((res) => {
      setTags(
        res?.data?.map((tag) => ({
          label: tag.tag,
          value: tag.id,
        }))
      );
    });
  }, []);

  const { setLoading, loading } = useLoader();

  const handleSubmit = async (values: any) => {
    if (loading) return;
    setLoading("Uploading video...");
    const id = await uploadVideo(values.media, getUserToken());

    if (!id) {
      setLoading("");
      notify.error("Failed to upload video");
    }

    const payload = {
      data: {
        title: values.title,
        description: values.description,
        media: id,
        videoTags: values.videoTags || [],
      },
    };

    const response = await api.post(
      endPoints.VIDEOS,
      payload,
      getAuthHeader(getUserToken())
    );
    setLoading("");

    if (!response.success) {
      notify.error("Failed to upload video");
      return;
    }

    setOpen(false);
    notify.success("Video uploaded successfully");
    router.reload();
  };

  return (
    <CenterModal isOpen={isOpen} setOpen={setOpen}>
      <div className="bg-app-gray-2 py-5 p-4 rounded-md w-96">
        <Formik
          onSubmit={handleSubmit}
          initialValues={
            {
              title: "",
              description: "",
              videoTags: [],
              media: null,
            } as any
          }
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            values,
            touched,
            errors,
            setValues,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Video"
                  fieldProps={{
                    type: "file",
                    name: "media",
                    onChange: (e) => {
                      const file = e?.currentTarget?.files?.[0];
                      console.log("file :-> ", file);
                      setValues({
                        ...values,
                        media: file,
                      });
                    },
                    onBlur: handleBlur,
                    placeholder: "Enter the description of the video",
                  }}
                  error={touched.description && errors.description}
                />
                <InputField
                  label="Title"
                  fieldProps={{
                    name: "title",
                    value: values.title,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    placeholder: "Enter the title of the video",
                  }}
                  error={touched.title && errors.title}
                />
                <InputField
                  label="Description"
                  fieldProps={{
                    name: "description",
                    value: values.description,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    placeholder: "Enter the description of the video",
                  }}
                  error={touched.description && errors.description}
                />
                <MultiSelectInput
                  label="Tags"
                  options={tags}
                  onSearchChange={setSearchValue}
                  searchValue={searchValue}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      videoTags: e,
                    });
                  }}
                  placeholder="Search for tags"
                  labelClassName="text-white"
                  error={touched.videoTags && errors.videoTags}
                  handleBlur={handleBlur}
                  value={values.videoTags}
                />
                <button
                  className="w-full py-2 bg-primary text-white rounded-md mt-5"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            );
          }}
        </Formik>
      </div>
    </CenterModal>
  );
};

export default UploadVideoModal;
