import { Parser } from "@json2csv/plainjs";
import { Key, Transaction } from "@prisma/client";

export default async function exportTransactionLogs(
  logs: (Transaction & { key: Key })[]
) {
  const formattedLogs = logs.map((log) => ({
    key: log.key.name,
    action: log.action,
    timestamp: log.timestamp.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // Convert logs to CSV
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(formattedLogs);

  // Create a temporary link to trigger download
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  // Create an anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = "transaction_logs.csv";
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the temporary anchor and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
