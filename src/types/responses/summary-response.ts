interface SummaryResponse {
  daily: {
    totalAmount: number;
  };
  weekly: {
    totalAmount: number;
  };
  monthly: {
    totalAmount: number;
  };
}

export default SummaryResponse;
