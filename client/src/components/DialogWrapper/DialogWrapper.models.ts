export interface Dialog {
  key: string; // example: 'strat-item/confirm-delete'
  text: string;
  resolve: () => void;
  reject: () => void;
  resolveBtn?: string;
  rejectBtn?: string;
  confirmOnly?: boolean;
}
