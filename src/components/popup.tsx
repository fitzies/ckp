import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Popup({
  title,
  description,
  trigger,
  size,
  children,
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  const modalSize =
    size === "lg" ? "min-w-[75%]" : size === "md" ? "min-w-[50%]" : "";
  return (
    <Dialog>
      {trigger}
      <DialogContent className={modalSize}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
