import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PageWrapper from "@/components/page-wrapper";
import { getAllCompanies } from "@/lib/db";
import Link from "next/link";

export default async function Page() {
  const companies = await getAllCompanies();

  return (
    <PageWrapper className="grid grid-cols-6 gap-4">
      {companies.map((company) => {
        return (
          <Link key={company.id} href={`/company/${company.id}`}>
            <Card className="aspect-square">
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.keys.length} keys</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </PageWrapper>
  );
}
