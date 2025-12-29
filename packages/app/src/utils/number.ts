export const formatCurrency = (
	amount: number,
	currency: string,
	locale = 'en-US'
) =>
	new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
	}).format(amount);
