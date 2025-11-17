export interface IRemainData {
  Company: string;
  DlvMode: string;
  Factory: string;
  ItemId: string;
  Qty: number;
  UnitId: string;
}

export interface IApiRemainsResponse {
  STATUS: string;
  MESSAGE: string;
  DATA: IRemainData[]; 
}

export interface IRemainsProps {
  remainData: IRemainData;
  loading?: boolean;
}