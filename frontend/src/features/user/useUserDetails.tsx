import { useState } from "react";
import { timer } from "../../shared/utils/timer.util";
import { checkImageAddress } from "./user-checks.utils";
import { useUserAuthRole } from "./useUserAuthStore";
import { useUserDetailsActions } from "./useUserDetailsStore";
import { useError } from "../../hooks/useError";

export const useUserDetails = () => {
  const [userAvatarData, setUserAvatarData] = useState<string>("");
  const [isAvatarUpdating, setIsAvatarUpdating] = useState<boolean>(false);
  const [userDisplayNameData, setUserDisplayNameData] = useState<string>("");
  const [isDisplayNameUpdating, setIsDisplayNameUpdating] =
    useState<boolean>(false);
  const [emptyField, setEmptyField] = useState<"avatar" | "displayName" | "">(
    "",
  );
  const { error, setError } = useError();
  const role = useUserAuthRole();
  const { updateAvatar, updateDisplayName } = useUserDetailsActions();

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserAvatarData(value);
    setEmptyField("");

    if (!value) return;

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

  const updateAvatarProcess = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
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
      const { response, result } = await updateAvatar(userAvatarData);

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
    } else {
      setError("Invalid image address.");

      await timer(3);
      setError("");
    }
  };

  const updateDisplayNameProcess = async (
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

    if (role === "user") {
      const { response, result } = await updateDisplayName(userDisplayNameData);

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
    updateAvatarProcess,
    updateDisplayNameProcess,
    handleAvatarUpdate,
    handleDisplayNameUpdate,
    cancelAvatarUpdate,
    cancelDisplayNameUpdate,
  };
};
