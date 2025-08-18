import type { Transaction } from "@/app/api/me/transactions/types";
import Currency from "@/src/types/currency";
import { cn } from "@/src/shadcn/lib/utils";
import formatPrice from "@/src/utils/format-price";
import getPaymentMethodLabel from "@/src/utils/payment-method-label";
import CategoryStoresInIcon from "../icons/category-stores-in";

export default function HistoryListItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const locale = "es-AR";
  const title = getPaymentMethodLabel(transaction.paymentMethod);

  const formattedAmount = formatPrice(transaction.amount, Currency.ARS, locale);

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString(
    locale,
    {
      month: "2-digit",
      year: "numeric",
      day: "2-digit",
    }
  );

  return (
    <div className="flex items-center gap-2 w-full py-3 px-2">
      <CategoryStoresInIcon className="size-8 text-uala-success flex-shrink-0" />
      <div className="flex flex-col gap-1 w-full">
        <span className="text-sm text-[#313643] font-semibold leading-none">
          {title}
        </span>
        <span className="text-sm text-[#606882] leading-none">Venta</span>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={cn("text-sm font-semibold leading-none", {
            "text-[#606882]": transaction.amount === 0,
            "text-red-500": transaction.amount < 0,
            "text-uala-success": transaction.amount > 0,
          })}
        >
          {formattedAmount.prefix}
          {formattedAmount.symbol}
          {formattedAmount.amount},{formattedAmount.decimals}
        </span>
        <span className="text-sm text-[#606882] leading-none">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
