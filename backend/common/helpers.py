from decimal import Decimal


def format_currency(amount: Decimal, currency_symbol: str = '₹') -> str:
    return f"{currency_symbol}{amount:,.2f}"