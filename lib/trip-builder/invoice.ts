import { prisma } from "@/lib/prisma";

/**
 * Generates the next unique invoice number in format VV-YYYYMM-######.
 * Uses InvoiceSequence table with transactional increment.
 */
export async function nextInvoiceNumber(): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;

  const updated = await prisma.$transaction(async (tx) => {
    const seq = await tx.invoiceSequence.upsert({
      where: { yearMonth },
      create: { yearMonth, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return seq;
  });

  return `VV-${yearMonth}-${String(updated.lastNumber).padStart(6, "0")}`;
}
