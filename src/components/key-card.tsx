import { Borrower, Key } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Popup from "./popup";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { borrowKey, returnKey } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { maskNric } from "@/lib/utils";

export default function KeyCard({ k }: { k: Key & { borrower: Borrower } }) {
  return (
    <Popup
      title={"Manage " + k.name + " Key"}
      description={
        k.borrower
          ? `${k.borrower.maskedNric}, ${k.borrower.name} is currently holding this
      key`
          : "This app will not remember any of the data you input"
      }
      trigger={
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:-translate-y-1 duration-150">
            <CardHeader>
              <CardTitle>{k.name}</CardTitle>
              <CardDescription className="flex justify-between">
                <p>
                  {k.numberOfKeys} {k.numberOfKeys > 1 ? "keys" : "key"}
                </p>
                <p className="text-sm text-zinc-400">
                  {k.borrower
                    ? `Borrowed by ${k.borrower.name}`
                    : "In keypress"}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </DialogTrigger>
      }
    >
      {k.borrower ? (
        <form
          className="flex flex-col gap-4"
          action={async () => {
            "use server";

            await returnKey(k.id, k.companyId);
            revalidatePath(`/company/${k.companyId}`);
          }}
        >
          <Button>Return Key</Button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4 px-1 py-4 rounded-xl"
          action={async (data: FormData) => {
            "use server";

            const [nric, name] = [
              data.get("nric")?.toString(),
              data.get("name")?.toString(),
            ];

            if (!nric || !name) {
              throw new Error("You never submitted a proper Name or NRIC");
            }

            await borrowKey(
              k.id,
              { name: name, maskedNric: maskNric(nric) },
              k.companyId
            );
            revalidatePath(`/company/${k.companyId}`);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label>NRIC</Label>
            <Input
              required
              placeholder="S0000001A"
              minLength={9}
              maxLength={9}
              pattern="^[S,T,F]\d{7}[A-Z]$" // Regular expression for NRIC format
              name="nric"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              required
              placeholder="John Doe"
              pattern="^[A-Za-z]+(?: [A-Za-z]+)*$" // Pattern for name format (letters and spaces only)
              title="Please enter a valid name (letters only, single space between first and last name)" // Optional tooltip
              name="name"
            />
          </div>
          <Button>Borrow Key</Button>
        </form>
      )}
    </Popup>
  );
}
