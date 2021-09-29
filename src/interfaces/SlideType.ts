import Attach from './Attach';

export default interface SlideType {
  title: string;
  subTitleList?: string[];
  imageList?: Attach[];
  url?: string;
  type?: string;
  icon?: string;
}
