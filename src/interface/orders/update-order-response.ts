import { ISimpleOrder } from "..";

export interface IUpdateOrderResponse {
  message: string;
  order: ISimpleOrder;
}
