
export interface Issue {
  id: number;
  name: string;
  issueDate: string;
  volume?: string;
  mailingListDate?: string;
  reservationDeadline?: string;
  materialDueDate?: string;
  filesShipDate?: string;
  proofsApprovedDate?: string;
  periodicalClass?: string;
  accountingCloseDate?: string;
  onSaleDate?: string;
  quantity?: number;
}
