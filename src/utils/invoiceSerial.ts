import type { Invoice } from "../types/invoice";

const getPayeeKey = (invoice: Invoice) =>
  (invoice.payee?.payeeSelectKey || invoice.payee?.companyName || "unknown")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");

/** Builds a 1-based sequence for each payee, ordered by invoice creation. */
export const getPayeeSerialNumbers = (invoices: Invoice[]) => {
  const serials = new Map<string, number>();
  const grouped = new Map<string, Invoice[]>();

  invoices.forEach((invoice) => {
    const payeeKey = getPayeeKey(invoice);
    const payeeInvoices = grouped.get(payeeKey) || [];
    payeeInvoices.push(invoice);
    grouped.set(payeeKey, payeeInvoices);
  });

  grouped.forEach((payeeInvoices) => {
    payeeInvoices
      .sort(
        (first, second) => {
          const dateDifference =
            new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
          return dateDifference || first._id.localeCompare(second._id);
        },
      )
      .forEach((invoice, index) => serials.set(invoice._id, index + 1));
  });

  return serials;
};
