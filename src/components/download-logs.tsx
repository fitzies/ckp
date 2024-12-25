"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import exportTransactionLogs from "@/lib/csv";
import { Borrower, Key, Transaction } from "@prisma/client";

export default function DownloadLogs({
  logs,
}: {
  logs: (Transaction & { key: Key; borrower: Borrower })[];
}) {
  return (
    <Button variant={"secondary"} onClick={() => exportTransactionLogs(logs)}>
      <Download className="scale-105" />
    </Button>
  );
}
