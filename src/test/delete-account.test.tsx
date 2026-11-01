import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const deleteAccount = vi.fn();
const signOut = vi.fn(async () => {});
const navigate = vi.fn();
vi.mock("@/lib/api/apiKeys", () => ({ deleteAccount: (...a: unknown[]) => deleteAccount(...a), deleteAllUserData: vi.fn() }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ signOut }) }));
vi.mock("react-router-dom", async (orig) => ({ ...(await orig<typeof import("react-router-dom")>()), useNavigate: () => navigate }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

import { DeleteMyData } from "@/components/DeleteMyData";

describe("Delete my account", () => {
  beforeEach(() => { deleteAccount.mockReset(); signOut.mockClear(); navigate.mockClear(); });

  it("only deletes after typing DELETE, then signs out and goes home", async () => {
    deleteAccount.mockResolvedValue({ deletedResults: 2, message: "ok" });
    render(<MemoryRouter><DeleteMyData /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Delete my account" }));
    await screen.findByLabelText("Type DELETE to confirm");
    const dialogConfirm = screen.getAllByRole("button", { name: "Delete my account" }).at(-1)!;
    expect(dialogConfirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "delete" } });
    expect(dialogConfirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
    expect(dialogConfirm).not.toBeDisabled();
    fireEvent.click(dialogConfirm);
    await waitFor(() => expect(deleteAccount).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(navigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("shows the error and stays signed in if deletion fails", async () => {
    deleteAccount.mockRejectedValue(new Error("Could not finish deleting the account."));
    render(<MemoryRouter><DeleteMyData /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Delete my account" }));
    fireEvent.change(await screen.findByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Delete my account" }).at(-1)!);
    expect(await screen.findByText("Could not finish deleting the account.")).toBeInTheDocument();
    expect(signOut).not.toHaveBeenCalled();
  });
});
