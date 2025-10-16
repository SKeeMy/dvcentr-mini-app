export interface IOrderData {
  ConsigneeAccount: string;
  ConsigneeName: string;
  DataAreaId: string;
  DlvMode: string[];
  InventLocationName: string[];
  InvoiceAccount: string;
  InvoiceAccountName: string;
  ItemId: string;
  ItemNameAlias: string;
  PowerOfAttorneyId: string;
  RContractAccount: string;
  RemainAmount: number;
  RemainQty: number;
  SalesId: string[];
  SalesQty: number;
}

export interface IApiData {
  Data: IOrderData[];
}

export interface IApiResponse {
  DATA: IApiData;
}

export interface IOrdersProps {
  orderData: IOrderData;
  loading?: boolean;
}