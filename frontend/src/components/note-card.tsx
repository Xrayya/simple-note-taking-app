import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NoteCard() {
  return (
    <Card size="sm" className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>
          This card uses the small size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter className="grid gap-2 grid-cols-2">
        <Button variant="outline" size="sm" className="w-full">
          Archive
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
