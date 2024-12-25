import KeyCard from "@/components/key-card";
import NotFound from "@/components/not-found";
import PageWrapper from "@/components/page-wrapper";
import Popup from "@/components/popup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createKey, deleteKey, getCompany } from "@/lib/db";
import { Borrower, Key } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function Page({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getCompany(companyId);

  if (!company) {
    return <NotFound />;
  }

  return (
    <PageWrapper className="flex flex-col">
      <div className="w-full flex justify-end">
        <Popup
          title="Manage Keys"
          description=""
          trigger={
            <Button asChild>
              <DialogTrigger>Manage Keys</DialogTrigger>
            </Button>
          }
          size="md"
        >
          <div className="flex flex-col gap-2">
            {company.keys.map((k) => {
              return (
                <Card key={"dialog-" + k.id}>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div className="flex flex-col gap-4">
                      <CardTitle>{k.name}</CardTitle>
                      <CardDescription>
                        <p>{k.id}</p>
                      </CardDescription>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteKey(k.id);
                        revalidatePath(`/company/${company.id}`);
                      }}
                    >
                      <Button variant={"destructive"}>Delete</Button>
                    </form>
                  </CardHeader>
                </Card>
              );
            })}
            <Card>
              <form
                action={async (data: FormData) => {
                  "use server";

                  const [keyName, numberOfKeys] = [
                    data.get("key-name")?.toString(),
                    data.get("number-of-keys")?.toString(),
                  ];

                  if (!keyName || !numberOfKeys) {
                    throw new Error("Something went wront");
                  }

                  await createKey(keyName, parseInt(numberOfKeys), companyId);
                  revalidatePath(`/company/${company.id}`);
                }}
              >
                <CardHeader className="flex flex-row justify-between items-start">
                  <div className="flex l gap-2">
                    <Input
                      placeholder="Key name"
                      name="key-name"
                      required
                      minLength={4}
                    />
                    <Input
                      placeholder="Number of keys"
                      type="number"
                      name="number-of-keys"
                      required
                      min={1}
                      max={30}
                    />
                  </div>
                  <Button variant={"default"}>Create</Button>
                </CardHeader>
              </form>
            </Card>
          </div>
        </Popup>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {company.keys.map((k) => {
          return (
            <KeyCard
              k={k as Key & { borrower: Borrower }}
              key={"main-" + k.id}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
}
