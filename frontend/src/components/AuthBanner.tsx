import { Link } from "react-router-dom";
import { getNekosiaImage } from "../shared/utils/get-nekosia.util";
import type { HTMLAttributes } from "react";

const {
  image: loginImage,
  source: loginSource,
  tags: loginTags,
  attribution: loginAttribution,
} = await getNekosiaImage();
const {
  image: signupImage,
  source: signupSource,
  tags: signupTags,
  attribution: signupAttribution,
} = await getNekosiaImage();

type AuthBannerProps = HTMLAttributes<HTMLDivElement> & {
  mode: "display" | "background";
  page: "login" | "signup";
};

export default function AuthBanner({ mode, page, className }: AuthBannerProps) {
  if (mode === "display")
    return (
      <div className={`relative flex flex-col col-span-2 h-230 ${className}`}>
        <Link
          to={page === "login" ? loginSource : signupSource}
          target="_blank"
          className="w-full h-full"
        >
          <img
            src={page === "login" ? loginImage : signupImage}
            alt={page === "login" ? loginTags : signupTags}
            className="object-cover w-full h-full"
          />
        </Link>
        <div className="absolute bottom-0 flex flex-col gap-5 w-full h-max items-center bg-linear-to-t from-black/60 py-8">
          <p className="text-sm text-right text-white">
            Image by{" "}
            <Link
              to={
                page === "login"
                  ? loginAttribution.artist.profile
                  : signupAttribution.artist.profile
              }
              target="_blank"
              className="font-semibold underline hover:text-primary transition-colors"
            >
              {page === "login"
                ? loginAttribution.artist.username
                : signupAttribution.artist.username}
            </Link>
          </p>
          <p className="text-sm text-center text-white">
            {page === "login"
              ? loginAttribution.copyright
              : signupAttribution.copyright}
          </p>
        </div>
      </div>
    );
  else if (mode === "background")
    return (
      <img
        src={page === "login" ? loginImage : signupImage}
        alt={page === "login" ? loginTags : signupTags}
        className={`object-cover h-full w-full absolute -z-1 ${className}`}
      />
    );
}
