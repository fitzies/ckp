import { Borrower, Key, Transaction } from "@prisma/client";
import * as XLSX from "xlsx";

export default async function exportTransactionLogs(
  logs: (Transaction & { key: Key; borrower: Borrower })[]
) {
  const formattedLogs = logs.map((log) => ({
    key: log.key.name,
    borrower: `${log.borrower.maskedNric}, ${log.borrower.name}`, // Assuming `borrowerName` exists in your `Transaction` model
    action: log.action,
    timestamp: log.timestamp.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // Create a worksheet from the formatted logs
  const ws = XLSX.utils.json_to_sheet(formattedLogs);

  // Create a workbook from the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transaction Logs");

  // Generate a binary string for the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  // Create a Blob object for the Excel file
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a temporary link to trigger the download
  const url = URL.createObjectURL(blob);

  // Create an anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = "transaction_logs.xlsx";
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the temporary anchor and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
