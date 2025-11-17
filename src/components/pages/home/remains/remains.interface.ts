export interface IRemainData {
  Company: string;
  DlvMode: string;
  Factory: string;
  ItemId: string;
  Qty: number;
  UnitId: string;
}

export interface IApiRemainsData {
  Data: IRemainData[];
}

export interface IApiRemainsResponse {
  STATUS: string;
  MESSAGE: string;
  DATA: IApiRemainsData;
}

export interface IRemainsProps {
  remainData: IRemainData;
  loading?: boolean;
}