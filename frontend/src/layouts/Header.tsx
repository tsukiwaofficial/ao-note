import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useUserLogout } from "../features/user/useUserLogout";
import { buttonVariants } from "../shared/config/ui-variants/button-variants.config";
import { MdLogout } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useUserAuthId,
  useUserAuthRole,
} from "../features/user/useUserAuthStore";
import {
  useUserDetailsAvatar,
  useUserDetailsDisplayName,
} from "../features/user/useUserDetailsStore";

const authRoutes = ["/login", "/signup"];

export default function Header() {
  const location = useLocation();
  const { logout } = useUserLogout();
  const _id = useUserAuthId();
  const role = useUserAuthRole();
  const avatar = useUserDetailsAvatar();
  const displayName = useUserDetailsDisplayName();

  return (
    <>
      <div className="fixed z-1000 max-h-20 h-full w-full bg-surface/50 backdrop-blur shadow-lg"></div>
      <header className="fixed z-1000 fixed-center ao-note-container max-h-20 h-full w-full flex items-center justify-between">
        <Link to="/">
          <h5>Ao Note</h5>
        </Link>
        <nav className="flex gap-10 items-center">
          <Link to={`users/${_id}`} className="flex items-center gap-2 group">
            {avatar || role === "guest" ? (
              <img
                src={avatar}
                alt="avatar"
                className="object-cover rounded-full max-w-10 aspect-square group-hover:scale-110 transition-transform"
              />
            ) : (
              <LoadingSpinner className="w-15" />
            )}
            <span className="font-semibold group-hover:text-primary transition-colors">
              {displayName}
            </span>
          </Link>
          {role === "user" && (
            <Button
              onClick={logout}
              variant="icon"
              className="border-error text-error hover:bg-error"
            >
              <MdLogout />
            </Button>
          )}
          <div className="space-x-3">
            {role === "guest" && !authRoutes.includes(location.pathname) && (
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
