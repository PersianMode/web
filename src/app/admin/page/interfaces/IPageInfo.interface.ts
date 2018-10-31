import {ICollection} from './ICollection.interface';

export interface IPageInfo {
  address: string;
  is_app: boolean;
  collection: ICollection;
  content: string;
  page_info: any;
}
