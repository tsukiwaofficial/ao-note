import { Link } from "react-router-dom";
import { getNekosiaImage } from "../shared/utils/get-nekosia.util";

const { image, tags, source, attribution } = await getNekosiaImage();

export default function Banner() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden w-full rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-[shadow_transform]">
        <Link to={source} target="_blank">
          <img
            src={image}
            alt={tags}
            className="object-cover w-full h-full max-h-300"
          />
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row-reverse xl:flex-col gap-5 justify-between">
        <p className="text-sm text-right text-slate-600">
          {attribution.artist.profile && "Image by"}{" "}
          <Link
            to={attribution.artist.profile}
            target="_blank"
            className="font-semibold text-primary hover:underline"
          >
            {attribution.artist.username && attribution.artist.username}
          </Link>
        </p>
        <p className="text-sm text-center text-slate-500">
          {attribution.copyright && attribution.copyright}
        </p>
      </div>
    </div>
  );
}
