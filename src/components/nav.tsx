import { BookKeyIcon } from "lucide-react";

export default function Nav() {
  return (
    <nav className="w-screen flex justify-start px-8 py-4 border-b">
      <h1 className="flex gap-4">
        <BookKeyIcon />
        <p className="font-semibold">Company Keypress</p>
      </h1>
      {/* <Avatar>
        <AvatarFallback>OL</AvatarFallback>
      </Avatar> */}
    </nav>
  );
}
