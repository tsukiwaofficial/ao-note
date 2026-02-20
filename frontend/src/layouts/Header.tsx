import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../features/user/useAuthContext";
import { Button } from "../components/ui/Button";
import { useUserLogout } from "../features/user/useUserLogout";
import { buttonVariants } from "../shared/config/ui-variants/button-variants.config";
import { MdLogout } from "react-icons/md";

const authRoutes = ["/login", "/signup"];

export default function Header() {
  const location = useLocation();
  const { state: user } = useAuthContext();
  const { logout } = useUserLogout();

  return (
    <>
      <div className="fixed z-1000 max-h-20 h-full w-full bg-surface/50 backdrop-blur shadow-lg"></div>
      <header className="fixed z-1000 fixed-center ao-note-container max-h-20 h-full w-full flex items-center justify-between">
        <Link to="/">
          <h5>Ao Note</h5>
        </Link>
        <nav className="flex gap-10 items-center">
          <h6 className="max-w-100 truncate capitalize">{user.role}</h6>
          {user.role === "user" && (
            <Button
              onClick={logout}
              variant="icon"
              className="border-error text-error hover:bg-error"
            >
              <MdLogout />
            </Button>
          )}
          <div className="space-x-3">
            {user.role === "guest" &&
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
