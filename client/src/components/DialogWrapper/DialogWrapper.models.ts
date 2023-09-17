export interface Dialog {
  key: string; // example: 'strat-item/confirm-delete'
  text: string;
  resolve: (value: boolean) => void;
  resolveBtn?: string;
  rejectBtn?: string;
  confirmOnly?: boolean;
  htmlMode?: boolean;
}
