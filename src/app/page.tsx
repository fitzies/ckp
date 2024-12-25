import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import PageWrapper from "@/components/page-wrapper";
import { getAllCompanies } from "@/lib/db";

export default async function Page() {
  const companies = await getAllCompanies();

  return (
    <PageWrapper className="grid grid-cols-4 gap-4">
      {companies.map((company) => {
        return (
          <Card key={company.id}>
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
          </Card>
        );
      })}
    </PageWrapper>
  );
}
