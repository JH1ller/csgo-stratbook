import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
  faCheck,
  faFilter,
  faPlus,
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
  faCopy,
  faCrown,
  faGamepad,
  faBomb,
  faSave,
  faShareAlt,
  faDownload,
  faQuestionCircle,
  faInfoCircle,
  faTimes,
  faComment,
  faWifi,
  faChevronLeft,
  faChevronRight,
  faMinusCircle,
  faCheckCircle,
  faEllipsisV,
  faBalanceScale,
  faMap,
  faEraser,
  faFont,
  faPencilAlt,
  faArrowsAlt,
  faLongArrowAltRight,
  faExclamationTriangle,
  faSignOutAlt,
  faCoffee,
  faHeadset,
  faThList,
  faCompressAlt,
  faExpandAlt,
  faCrosshairs,
  faExpand,
  faMapMarkerAlt,
  faPhotoVideo,
  faAlignCenter,
  faMousePointer,
  faICursor,
  faNetworkWired,
  faCog,
  faSignInAlt,
  faUserTag,
  faUserTimes,
  faCaretDown,
  faMoon,
  faSun,
  faCloudDownloadAlt,
  faUser,
  faSortNumericDown,
  faSortNumericUpAlt,
  faSort,
  faHome,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub, faTwitter, faSteam, faSteamSymbol } from '@fortawesome/free-brands-svg-icons';
import { faCircle, faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default function loadIcons() {
  config.autoAddCss = false;

  library.add(
    faEdit,
    faTrashAlt,
    faBan,
    faFilm,
    faCheck,
    faFilter,
    faPlus,
    faTools,
    faUtensils,
    faBoxes,
    faUsers,
    faChess,
    faCopy,
    faCrown,
    faGamepad,
    faBomb,
    faSave,
    faShareAlt,
    faTwitter,
    faDownload,
    faQuestionCircle,
    faInfoCircle,
    faTimes,
    faComment,
    faWifi,
    faChevronLeft,
    faChevronRight,
    faMinusCircle,
    faCheckCircle,
    faEllipsisV,
    faBalanceScale,
    faMap,
    faEraser,
    faFont,
    faPencilAlt,
    faArrowsAlt,
    faLongArrowAltRight,
    faCircle,
    faExclamationTriangle,
    faSignOutAlt,
    faCoffee,
    faDiscord,
    faHeadset,
    faThList,
    faCompressAlt,
    faExpandAlt,
    faCrosshairs,
    faExpand,
    faMapMarkerAlt,
    faPhotoVideo,
    faAlignCenter,
    faMousePointer,
    faICursor,
    faNetworkWired,
    faCog,
    faGithub,
    faSignInAlt,
    faUserTag,
    faUserTimes,
    faCaretDown,
    faMoon,
    faSun,
    faCloudDownloadAlt,
    faUser,
    faSortNumericDown,
    faSortNumericUpAlt,
    faSort,
    faCrown,
    faEye,
    faSteam,
    faSteamSymbol,
    faHome,
    faArrowLeft,
    faArrowRight,
  );

  Vue.component('fa-icon', FontAwesomeIcon);
}
