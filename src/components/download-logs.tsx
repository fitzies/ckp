"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import exportTransactionLogs from "@/lib/csv";
import { Key, Transaction } from "@prisma/client";

export default function DownloadLogs({
  logs,
}: {
  logs: (Transaction & { key: Key })[];
}) {
  return (
    <Button variant={"secondary"} onClick={() => exportTransactionLogs(logs)}>
      <Download className="scale-105" />
    </Button>
  );
}
