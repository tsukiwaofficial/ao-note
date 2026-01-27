export const getNekosiaImage = async () => {
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
