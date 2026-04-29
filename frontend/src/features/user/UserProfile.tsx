import { defaultAvatar } from "./user.config";
import { FaCheck, FaPencil, FaXmark } from "react-icons/fa6";
import { Button } from "../../components/ui/Button";
import { useUserDetails } from "./useUserDetails";
import LoadingSpinner from "../../components/LoadingSpinner";
import AoNoteError from "../../components/AoNoteError";
import { Link } from "react-router-dom";
import { buttonVariants } from "../../shared/config/ui-variants/button-variants.config";
import { formatDate } from "date-fns";
import {
  useUserDetailsActions,
  useUserDetailsAvatar,
  useUserDetailsCreatedAt,
  useUserDetailsDisplayName,
} from "./useUserDetailsStore";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useUserAuthId, useUserAuthToken } from "./useUserAuthStore";

export default function UserProfile({ role }: { role: "user" | "guest" }) {
  const {
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
  } = useUserDetails();
  const [cookies] = useCookies(["isLoggedIn"]);
  const _id = useUserAuthId();
  const token = useUserAuthToken();
  const avatar = useUserDetailsAvatar();
  const displayName = useUserDetailsDisplayName();
  const createdAt = useUserDetailsCreatedAt();
  const { getUserDetails } = useUserDetailsActions();

  useEffect(() => {
    getUserDetails(_id, token, cookies.isLoggedIn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, displayName, role, cookies.isLoggedIn]);

  return (
    <>
      <div
        className={`w-max h-max flex flex-col bg-surface px-10 py-8 rounded-xl shadow-lg ${error && !isAvatarUpdating && "animate-shake"}`}
      >
        <div className="flex items-center gap-5">
          {avatar || role === "guest" ? (
            <>
              {role === "user" ? (
                <div
                  className="overflow-hidden relative rounded-full w-50 aspect-square cursor-pointer group"
                  onClick={() => setIsAvatarUpdating(true)}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    className="object-cover w-full h-full group-hover:brightness-50 transition-[filter]"
                  />
                  <span className="absolute bottom-0 text-surface flex items-center justify-center h-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity_visibility]">
                    <FaPencil />
                  </span>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="overflow-hidden relative rounded-full w-50 aspect-square cursor-pointer group"
                >
                  <img
                    src={defaultAvatar}
                    alt="avatar"
                    className="object-cover w-full h-full group-hover:brightness-50 transition-[filter]"
                  />
                  <span className="absolute bottom-0 text-surface flex items-center justify-center h-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity_visibility]">
                    <FaPencil />
                  </span>
                </Link>
              )}
              <div className="flex flex-col ">
                <span>Display Name</span>
                {isDisplayNameUpdating ? (
                  <form
                    className="flex items-center gap-5 min-w-50"
                    onSubmit={updateDisplayNameProcess}
                  >
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      placeholder={displayName}
                      className={`text-4xl bg-transparent outline-0 rounded-none h-15 field-sizing-content font-semibold text-wrap placeholder:font-semibold ${emptyField === "displayName" ? "animate-shake placeholder:text-error/50" : ""}`}
                      value={userDisplayNameData}
                      onChange={handleDisplayNameUpdate}
                      maxLength={20}
                      autoFocus
                    />
                    <Button
                      variant="icon"
                      className="hover:bg-error border-error text-error"
                      type="button"
                      onClick={cancelDisplayNameUpdate}
                    >
                      <FaXmark />
                    </Button>
                    <Button
                      variant="icon"
                      className="hover:bg-primary border-primary text-primary"
                      type="submit"
                    >
                      <FaCheck />
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-5 min-w-50 h-15">
                    <h4 className="font-semibold">{displayName}</h4>
                    {role === "user" ? (
                      <Button
                        variant="icon"
                        className="hover:bg-primary"
                        onClick={() =>
                          setIsDisplayNameUpdating((prev) => !prev)
                        }
                      >
                        <FaPencil />
                      </Button>
                    ) : (
                      <Link
                        to="/login"
                        className={`${buttonVariants({ variant: "icon" })} hover:bg-primary`}
                      >
                        <FaPencil />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <LoadingSpinner className="w-50" />
          )}
        </div>
        {role === "user" && (
          <span className="text-sm mt-5 text-right">
            {formatDate(
              new Date(createdAt ? createdAt : Date.now()),
              "LL-dd-yyyy",
            )}
          </span>
        )}
        {role === "guest" && (
          <div className="mt-10 mx-auto">
            <Link
              to="/login"
              className="font-semibold hover:underline hover:text-primary transition-[color_text-decoration]"
            >
              Login
            </Link>{" "}
            to update your profile.
          </div>
        )}
      </div>
      {!isAvatarUpdating && (
        <AoNoteError
          error={error}
          className={`w-max fixed bottom-[10%] left-[50%] -translate-x-[50%] -translate-y-[50%] ${error ? "-translate-y-10 opacity-100 visible" : "translate-y-10 opacity-0 invisible"} transition-[opacity_visibility_translate]`}
        />
      )}
      <div
        className={`fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-start gap-10 bg-surface shadow-lg rounded-xl py-10 px-15 w-max ${isAvatarUpdating ? "-translate-y-5" : "invisible opacity-0 translate-y-5"} ${error ? "animate-shake" : ""} z-10 transition-[opacity_visibility_translate]`}
      >
        <div className="space-y-2">
          <h6 className="text-center">Old</h6>
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="object-cover w-80 aspect-square rounded-full "
            />
          ) : (
            <LoadingSpinner className="w-80" />
          )}
        </div>
        <div className="space-y-2">
          <h6 className="text-center">New</h6>
          <img
            src={userAvatarData ? userAvatarData : defaultAvatar}
            alt="avatar"
            className={`object-cover w-80 aspect-square rounded-full border-2 ${error ? "border-error animate-shake" : "border-transparent"} transition-colors`}
          />
        </div>
        <div className="h-full flex flex-col">
          <form className="" onSubmit={updateAvatarProcess}>
            <div className="flex flex-col gap-2 mb-5">
              <label htmlFor="avatar">New Avatar Image Address</label>
              <input
                type="text"
                name="avatar"
                id="avatar"
                placeholder="Image Address"
                className={`text-2xl px-4 py-6 border-2 outline-none w-150 ${emptyField === "avatar" || error ? "border-error" : "border-primary"} transition-colors`}
                value={userAvatarData}
                onChange={handleAvatarUpdate}
              />
            </div>
            <span className="flex w-max gap-3 ml-auto">
              <Button variant="cta" type="button">
                Preview
              </Button>
              <Button
                variant="outline"
                className="hover:bg-primary border-primary text-primary"
                type="submit"
              >
                Save
              </Button>
            </span>
          </form>
          <AoNoteError error={error} className="mt-5 w-max" />
        </div>
        <Button
          variant="icon"
          className="hover:bg-error border-error text-error"
          type="button"
          onClick={cancelAvatarUpdate}
        >
          <FaXmark />
        </Button>
      </div>
    </>
  );
}
