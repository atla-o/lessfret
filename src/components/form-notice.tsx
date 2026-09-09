import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { crisisLine } from "@/lib/legal";
import { CircleAlert, Info } from "lucide-react";

export function ScopeNotice({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Alert className="border-foreground/12 bg-muted/40 px-4 py-3">
      <Info />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-1 text-pretty">{children}</AlertDescription>
    </Alert>
  );
}

export function CrisisNotice() {
  return (
    <Alert className="border-foreground/20 px-4 py-3">
      <CircleAlert />
      <AlertTitle>Not for emergencies</AlertTitle>
      <AlertDescription className="mt-1">{crisisLine}</AlertDescription>
    </Alert>
  );
}
