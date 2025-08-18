import Currency from "../types/currency";

const DEFAULT_SYMBOL = "$";

const currencySymbols = {
	[Currency.USD]: "U$S",
	[Currency.ARS]: "$",
};

export default function formatPrice(
	price: number,
	currency: Currency,
	locale: Intl.LocalesArgument,
) {
	const prefix = price > 0 ? "+" : price < 0 ? "-" : "";

	const symbol = currencySymbols[currency] || DEFAULT_SYMBOL;

	// Obtener el valor absoluto para formatear
	const absolutePrice = Math.abs(price);

	// Formatear el número con separadores de miles
	const amount = absolutePrice.toLocaleString(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	// Obtener los decimales reales o "00" si no hay
	const hasDecimals = absolutePrice % 1 !== 0;
	const decimals = hasDecimals
		? Math.round((absolutePrice % 1) * 100)
				.toString()
				.padStart(2, "0")
		: "00";

	return {
		prefix,
		symbol,
		amount,
		decimals,
	};
}
