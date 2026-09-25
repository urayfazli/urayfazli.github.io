// Static image assets stored directly in the source code
import avatarImage from './chibi_uray_avatar_1790346065453.jpg';
import bgDesktopImage from './bg_desktop_wallpaper_1790350355867.jpg';
import bgMobileImage from './bg_mobile_wallpaper_1790350373616.jpg';

export const ASSET_IMAGES = {
  avatar: avatarImage,
  bgDesktop: bgDesktopImage,
  bgMobile: bgMobileImage,
} as const;

export default ASSET_IMAGES;
