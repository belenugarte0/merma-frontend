import { ISimpleClassific, ISimpleClassificModel } from "./simple-classific";

export interface IClassificsResponse {
  orders: ISimpleClassific[];
  placabase: ISimpleClassificModel[];

}
