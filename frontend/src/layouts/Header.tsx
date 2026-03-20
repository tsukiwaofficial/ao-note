import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../features/user/useAuthContext";
import { Button } from "../components/ui/Button";
import { useUserLogout } from "../features/user/useUserLogout";
import { buttonVariants } from "../shared/config/ui-variants/button-variants.config";
import { MdLogout } from "react-icons/md";
import { useUserContext } from "../features/user/useUserContext";
import { defaultAvatar } from "../features/user/user.config";
import LoadingSpinner from "../components/LoadingSpinner";

const authRoutes = ["/login", "/signup"];

export default function Header() {
  const location = useLocation();
  const { state: userAuth } = useAuthContext();
  const { state: userDetails } = useUserContext();
  const { logout } = useUserLogout();

  return (
    <>
      <div className="fixed z-1000 max-h-20 h-full w-full bg-surface/50 backdrop-blur shadow-lg"></div>
      <header className="fixed z-1000 fixed-center ao-note-container max-h-20 h-full w-full flex items-center justify-between">
        <Link to="/">
          <h5>Ao Note</h5>
        </Link>
        <nav className="flex gap-10 items-center">
          <Link
            to={`users/${userAuth.role === "user" ? userAuth._id : userAuth.role}`}
            className="flex items-center gap-2 group"
          >
            {Object.keys(userDetails).length > 0 ||
            userAuth.role === "guest" ? (
              <img
                src={
                  userAuth.role === "user" ? userDetails.avatar : defaultAvatar
                }
                alt="avatar"
                className="object-cover rounded-full max-w-10 aspect-square group-hover:scale-110 transition-transform"
              />
            ) : (
              <LoadingSpinner className="w-15" />
            )}
            <span className="font-semibold group-hover:text-primary transition-colors">
              {userAuth.role === "user"
                ? userDetails.displayName
                : userAuth.role}
            </span>
          </Link>
          {userAuth.role === "user" && (
            <Button
              onClick={logout}
              variant="icon"
              className="border-error text-error hover:bg-error"
            >
              <MdLogout />
            </Button>
          )}
          <div className="space-x-3">
            {userAuth.role === "guest" &&
              !authRoutes.includes(location.pathname) && (
                <>
                  <Link
                    to="/login"
                    className={`${buttonVariants({ variant: "outline" })} bg-background`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={buttonVariants({ variant: "cta" })}
                  >
                    Sign Up
                  </Link>
                </>
              )}
          </div>
        </nav>
      </header>
    </>
  );
}
