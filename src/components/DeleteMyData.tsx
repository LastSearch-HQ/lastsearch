import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount, deleteAllUserData } from "@/lib/api/apiKeys";

/** Self-serve erasure: removes every stored result (including shared result pages) and every API key; or closes the account. */
export function DeleteMyData() {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [acct, setAcct] = useState<"idle" | "working" | "error">("idle");
  const [acctMessage, setAcctMessage] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const closeAccount = async () => {
    setAcct("working");
    try {
      await deleteAccount();
      await signOut().catch(() => undefined);
      toast.success("Your account and all its data have been deleted.");
      navigate("/", { replace: true });
    } catch (e) {
      setAcctMessage(e instanceof Error ? e.message : "Something went wrong. Email shreyassaw@gmail.com and we will do it by hand.");
      setAcct("error");
    }
  };

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
        <CardTitle className="text-lg flex items-center gap-2"><Trash2 className="w-5 h-5 text-destructive" /> Your data and account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Permanently delete your query history, every stored result (shared links stop working) and all your API keys. Research sessions can
          be deleted individually on the Sessions page, or close the whole account below.
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
        <div className="pt-4 mt-2 border-t border-border space-y-2">
          <p className="text-sm font-medium">Delete my account</p>
          <p className="text-sm text-muted-foreground">
            Closes your account for good: your results, API keys, research sessions and any interest-form entry are deleted, you are signed out
            everywhere, and the login is removed. You can sign up again later as a new account.
          </p>
          {acct === "error" && <p className="text-sm text-destructive" role="status">{acctMessage}</p>}
          <AlertDialog onOpenChange={(open) => { if (!open) setConfirmText(""); }}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/40" disabled={acct === "working"}>
                {acct === "working" ? "Deleting account…" : "Delete my account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Everything tied to it is deleted and you are signed out. Agents using your keys stop working. This cannot be undone. Type DELETE to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input aria-label="Type DELETE to confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" autoComplete="off" />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={closeAccount} disabled={confirmText !== "DELETE"} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete my account</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
