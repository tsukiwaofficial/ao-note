import { useState } from "react";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { timer } from "../../shared/utils/timer.util";
import { useUserContext } from "./useUserContext";
import { useAuthContext } from "./useAuthContext";
import { putOptions } from "../../shared/utils/http/fetch-options.utils";
import { checkImageAddress } from "./user-checks.utils";

export const useUserDetails = () => {
  const [userAvatarData, setUserAvatarData] = useState<string>("");
  const [isAvatarUpdating, setIsAvatarUpdating] = useState<boolean>(false);
  const [userDisplayNameData, setUserDisplayNameData] = useState<string>("");
  const [isDisplayNameUpdating, setIsDisplayNameUpdating] =
    useState<boolean>(false);
  const [emptyField, setEmptyField] = useState<"avatar" | "displayName" | "">(
    "",
  );
  const [error, setError] = useState<string>("");
  const { dispatch } = useUserContext();
  const { state: userAuth } = useAuthContext();

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserAvatarData(value);
    setEmptyField("");

    await timer(1);
    const isImageVerified = await checkImageAddress(value);

    if (isImageVerified) return;
    else {
      setError("Invalid image address.");

      await timer(3);
      setError("");

      return;
    }
  };

  const handleDisplayNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserDisplayNameData(value);
    setEmptyField("");
  };

  const updateAvatar = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userAvatarData === "") {
      setEmptyField("avatar");
      setError("Your avatar cannot be empty.");

      await timer(3);
      setError("");

      return;
    }

    const isImageVerified = await checkImageAddress(userAvatarData);

    if (isImageVerified) {
      const payload = {
        avatar: userAvatarData,
      };

      if (userAuth.role === "user") {
        const response = await aoNoteFetch(
          `/api/users/${userAuth._id}/avatar`,
          {
            ...putOptions<{ avatar: string }>(payload),
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message);

          await timer(3);
          setError("");
          setEmptyField("");
          setUserAvatarData("");
          setIsAvatarUpdating(false);

          return;
        }

        setIsAvatarUpdating(false);
        setError("");
        setEmptyField("");
        setUserAvatarData("");
        dispatch({
          type: "UPDATE_AVATAR",
          payload: payload.avatar,
        });
      }
    } else {
      setError("Invalid image address.");

      await timer(3);
      setError("");
    }
  };

  const updateDisplayName = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (userDisplayNameData === "") {
      setEmptyField("displayName");
      setError("Your display name cannot be empty.");

      await timer(3);
      setError("");

      return;
    }

    const payload = {
      displayName: userDisplayNameData,
    };

    if (userAuth.role === "user") {
      const response = await aoNoteFetch(`/api/users/${userAuth._id}/name`, {
        ...putOptions<{ displayName: string }>(payload),
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);

        await timer(3);
        setError("");
        setEmptyField("");
        setUserDisplayNameData("");
        setIsDisplayNameUpdating(false);

        return;
      }

      setIsDisplayNameUpdating(false);
      setError("");
      setEmptyField("");
      setUserDisplayNameData("");
      dispatch({
        type: "UPDATE_DISPLAY_NAME",
        payload: payload.displayName,
      });
    }
  };

  const cancelAvatarUpdate = async () => {
    setIsAvatarUpdating(false);
    setUserAvatarData("");
    setEmptyField("");
    setError("");
  };

  const cancelDisplayNameUpdate = async () => {
    setIsDisplayNameUpdating(false);
    setUserDisplayNameData("");
    setEmptyField("");
    setError("");
  };

  return {
    userAvatarData,
    isAvatarUpdating,
    setIsAvatarUpdating,
    userDisplayNameData,
    isDisplayNameUpdating,
    setIsDisplayNameUpdating,
    emptyField,
    error,
    updateAvatar,
    updateDisplayName,
    handleAvatarUpdate,
    handleDisplayNameUpdate,
    cancelAvatarUpdate,
    cancelDisplayNameUpdate,
  };
};
