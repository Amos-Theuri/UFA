// src/lib/assetResolvers.js
// Resolves image paths, bundled assets, remote URLs, and data URLs for merchandise and officials

import armBand from "../assets/merch_1.png";
import noteBook from "../assets/merch_2.png";
import Scarf from "../assets/merch_3.png";
import Hoodie from "../assets/merch_4.png";
import Umbrella from "../assets/merch_5.png";
import Cap from "../assets/merch_6.png";
import Tshirt from "../assets/merch_7.png";
import Polo from "../assets/merch_8.png";
import Shirt from "../assets/merch_9.png";

import official1 from "../assets/official_1.jpeg";
import official2 from "../assets/official_2.jpeg";
import official3 from "../assets/official_3.jpeg";
import official4 from "../assets/official_4.jpeg";
import official5 from "../assets/official_5.jpeg";
import official6 from "../assets/official_6.jpeg";
import official7 from "../assets/official_7.jpg";
import official8 from "../assets/official_8.jpeg";
import official9 from "../assets/official_9.jpeg";
import official10 from "../assets/official_10.jpg";
import official11 from "../assets/official_11.jpeg";

const merchAssetMap = {
  "merch_1.png": armBand,
  "merch_2.png": noteBook,
  "merch_3.png": Scarf,
  "merch_4.png": Hoodie,
  "merch_5.png": Umbrella,
  "merch_6.png": Cap,
  "merch_7.png": Tshirt,
  "merch_8.png": Polo,
  "merch_9.png": Shirt,
  armband: armBand,
  notebook: noteBook,
  scarf: Scarf,
  hoodie: Hoodie,
  umbrella: Umbrella,
  cap: Cap,
  tshirt: Tshirt,
  polo: Polo,
  shirt: Shirt
};

const officialAssetMap = {
  1: official1,
  2: official5,
  3: official4,
  4: official3,
  5: official6,
  6: official2,
  7: official7,
  8: official8,
  9: official9,
  10: official10,
  11: official11,
  "/officials/official_1.jpeg": official1,
  "/officials/official_2.jpeg": official2,
  "/officials/official_3.jpeg": official3,
  "/officials/official_4.jpeg": official4,
  "/officials/official_5.jpeg": official5,
  "/officials/official_6.jpeg": official6,
  "/officials/official_7.jpg": official7,
  "/officials/official_7.jpeg": official7,
  "/officials/official_8.jpeg": official8,
  "/officials/official_8.jpg": official8,
  "/officials/official_9.jpeg": official9,
  "/officials/official_9.jpg": official9,
  "/officials/official_10.jpg": official10,
  "/officials/official_10.jpeg": official10,
  "/officials/official_11.jpeg": official11,
  "/officials/official_11.jpg": official11,
  "official_1.jpeg": official1,
  "official_2.jpeg": official2,
  "official_3.jpeg": official3,
  "official_4.jpeg": official4,
  "official_5.jpeg": official5,
  "official_6.jpeg": official6,
  "official_7.jpg": official7,
  "official_7.jpeg": official7,
  "official_8.jpeg": official8,
  "official_8.jpg": official8,
  "official_9.jpeg": official9,
  "official_9.jpg": official9,
  "official_10.jpg": official10,
  "official_10.jpeg": official10,
  "official_11.jpeg": official11,
  "official_11.jpg": official11
};

export function resolveMerchImage(item) {
  if (!item) return armBand;
  const image = typeof item === "string" ? item : (item.image || item.image_url);
  const id = typeof item === "object" ? item.id : null;

  if (image && (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/assets/"))) {
    return image;
  }
  if (image && merchAssetMap[image]) return merchAssetMap[image];
  if (id && merchAssetMap[id]) return merchAssetMap[id];
  if (image) {
    const filename = image.split("/").pop();
    if (filename && merchAssetMap[filename]) return merchAssetMap[filename];
  }
  return armBand;
}

export function resolveOfficialImage(official) {
  if (!official) return official1;
  const imagePath = typeof official === "string" ? official : (official.image || official.image_url);
  const id = typeof official === "object" ? official.id : null;

  if (imagePath && (imagePath.startsWith("data:") || imagePath.startsWith("http://") || imagePath.startsWith("https://"))) {
    return imagePath;
  }
  if (id && officialAssetMap[id]) return officialAssetMap[id];
  if (imagePath && officialAssetMap[imagePath]) return officialAssetMap[imagePath];
  if (imagePath) {
    const filename = imagePath.split("/").pop();
    if (filename && officialAssetMap[filename]) return officialAssetMap[filename];
    const base = import.meta.env.BASE_URL || "/";
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${base}${cleanPath}`;
  }
  return official1;
}

