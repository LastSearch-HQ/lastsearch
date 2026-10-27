import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAllUserData } from "@/lib/api/apiKeys";

/** Self-serve erasure: removes every stored result (including shared result pages) and every API key. */
export function DeleteMyData() {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const run = async () => {
    setState("working");
    try {
      const r = await deleteAllUserData();
      setMessage(`Deleted ${r.deleted} stored result${r.deleted === 1 ? "" : "s"} and all API keys.`);
      setState("done");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong. Email shreyassaw@gmail.com and we will do it by hand.");
      setState("error");
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Trash2 className="w-5 h-5 text-destructive" /> Your data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Permanently delete your query history, every stored result (shared links stop working) and all your API keys. Research sessions can
          be deleted individually on the Sessions page. To close the account itself, email{" "}
          <a href="mailto:shreyassaw@gmail.com?subject=Delete%20my%20account" className="underline">shreyassaw@gmail.com</a>.
        </p>
        {state === "done" || state === "error" ? (
          <p className={`text-sm ${state === "done" ? "text-foreground" : "text-destructive"}`} role="status">{message}</p>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/40" disabled={state === "working"}>
                {state === "working" ? "Deleting…" : "Delete all my data"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes your query history, stored results and API keys at once. Agents using your keys will stop working. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={run} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete everything</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
