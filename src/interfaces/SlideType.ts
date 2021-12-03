import Attach from './Attach';

export default interface SlideType {
  title: string;
  paths: string[];
  subTitleList?: SubTitleType[];
  imageList?: Attach[];
  url?: string;
  type?: string;
  linkType?: string;
  icon?: string;
}

interface SubTitleType {
  title: string;
  type?: string;
  url?: string;
}
