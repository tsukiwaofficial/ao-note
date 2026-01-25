import { Link } from "react-router-dom";

const getBg = async () => {
  const response = await fetch(import.meta.env.VITE_NEKOSIA_API);
  const result = await response.json();

  const image = result.image.compressed.url;
  const tags = result.tags;
  const source = result.source.url;
  const attribution: {
    artist: { username: string; profile: string };
    copyright: string;
  } = result.attribution;

  return {
    image,
    tags,
    source,
    attribution,
  };
};
const { image, tags, source, attribution } = await getBg();

export default function Banner() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-[shadow_transform]">
        <Link to={source} target="_blank">
          <img
            src={image}
            alt={tags}
            className="object-cover w-full h-full max-w-125 max-h-200"
          />
        </Link>
      </div>
      <p className="text-base text-right text-slate-600">
        Image by{" "}
        <Link
          to={attribution.artist.profile}
          target="_blank"
          className="font-semibold text-primary hover:underline"
        >
          {attribution.artist.username}
        </Link>
      </p>
      <p className="text-sm text-center text-slate-500">
        {attribution.copyright}
      </p>
    </div>
  );
}
