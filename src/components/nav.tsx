import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Nav() {
  return (
    <nav className="w-screen flex justify-end px-8 py-4 border-b">
      <Avatar>
        <AvatarFallback>OL</AvatarFallback>
      </Avatar>
    </nav>
  );
}
