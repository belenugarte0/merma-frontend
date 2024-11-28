import { ISimpleBoard } from "./simple-board";

export interface IUpdateBoardResponse {
  message: string;
  board: ISimpleBoard;
}
