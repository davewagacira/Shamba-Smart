// free photos from Unsplash (unsplash.com/license)
const u = (id: string) => `https://images.unsplash.com/${id}?w=2000&q=80&fm=jpg&fit=crop`;

export const PHOTOS = {
  hero: { src: u("photo-1741874299706-2b8e16839aaa"), alt: "A farmer tending young crops in a green field with hills behind" },
  seedling: { src: u("photo-1590682680695-43b964a3ae17"), alt: "Hands planting a seedling in dark soil" },
  grain: { src: u("photo-1710149484964-d966b771c204"), alt: "A farmer letting harvested grain fall from her hands" },
  farmer: { src: u("photo-1746014929708-fcb859fd3185"), alt: "A farmer harvesting leafy greens" },
  team: { src: u("photo-1509099381441-ea3c0cf98b94"), alt: "People working together in a field" },
  pair: { src: u("photo-1736967327745-b66c0e2a609d"), alt: "Two farmers standing in a field of tall grass" },
};
