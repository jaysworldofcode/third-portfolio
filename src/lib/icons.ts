import type { IconType } from "react-icons";
import {
  FaBehance,
  FaCamera,
  FaChartLine,
  FaCode,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaLocationDot,
  FaMobileScreen,
  FaPalette,
  FaPenNib,
  FaPhone,
  FaRegEnvelope,
  FaRocket,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

/** Icon names that can be used in `content/site.json`. */
const ICONS: Record<string, IconType> = {
  behance: FaBehance,
  camera: FaCamera,
  chart: FaChartLine,
  code: FaCode,
  discord: FaDiscord,
  dribbble: FaDribbble,
  email: FaRegEnvelope,
  facebook: FaFacebookF,
  github: FaGithub,
  globe: FaGlobe,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  location: FaLocationDot,
  mobile: FaMobileScreen,
  palette: FaPalette,
  pen: FaPenNib,
  phone: FaPhone,
  rocket: FaRocket,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  x: FaXTwitter,
  youtube: FaYoutube,
};

export const ICON_NAMES = Object.keys(ICONS);

const FALLBACK_ICON = FaLink;

export function getIcon(name: string): IconType {
  return ICONS[name.toLowerCase()] ?? FALLBACK_ICON;
}
