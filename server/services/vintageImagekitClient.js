import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

export const vintageImagekit = new ImageKit({
  publicKey: process.env.VINTAGE_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.VINTAGE_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.VINTAGE_IMAGEKIT_URL_ENDPOINT,
});