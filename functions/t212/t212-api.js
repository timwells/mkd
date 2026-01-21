const T212_HOST = `https://live.trading212.com/api/v0`
const T212_HOST2 = `https://live.trading212.com`

import { setTimeout } from 'node:timers/promises'

export const OpenOrders = async (t212Key) => {
  const response = await fetch(`${T212_HOST}/equity/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${t212Key}`,
    },
  })

  const data = await response.json()
  // Use a Map to preserve the order of first appearance of each ticker
  const grouped = new Map()

  data.forEach((order) => {
    const ticker = order.instrument.ticker
    const name = order.instrument.name
    const key = ticker // group by ticker code

    if (!grouped.has(key)) {
      grouped.set(key, {
        ticker: key,
        name: name,
        totalQuantity: 0,
        totalValue: 0,
        ordersCount: 0,
        orders: [],
      })
    }

    order.createdAt = order.createdAt.split('T')[0] // keep only date part
    // reduce object noise

    // delete order.id
    delete order.extendedHours
    delete order.initiatedFrom

    grouped.get(key).orders.push({ ...order })
    grouped.get(key).totalQuantity += order.quantity
    grouped.get(key).totalValue += order.limitPrice * order.quantity
    grouped.get(key).ordersCount++

    grouped.get(key).totalValue = +parseFloat(grouped.get(key).totalValue.toFixed(2))
  })

  // Convert Map values to array (preserves insertion order)
  return Array.from(grouped.values())
}

export const CancelOrder = async (t212Key, orderId) => {
  const response = await fetch(`${T212_HOST}/equity/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${t212Key}`,
    },
  })

  if (!response.ok) {
    // const errorData = await response.json().catch(() => ({}));
    return errorData.message || `HTTP ${response.status}`
  }

  return { status: 'ok', message: 'Order cancelled successfully' }
}

export const DividendHistory = async (t212Key) => {
  let allDividends = []
  let nextPagePath = `/api/v0/equity/history/dividends?limit=50`

  do {
    const reqPath = `${T212_HOST2}${nextPagePath}`
    const response = await fetch(reqPath, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${t212Key}` },
    })

    const data = await response.json()
    allDividends.push(...data.items)

    nextPagePath = data.nextPagePath

    if (nextPagePath != null) {
      // simple rate limit
      await setTimeout(250)
    }
  } while (nextPagePath !== null)

  const dividends = allDividends
    .map((order) => {
      order.name = order.instrument.name
      order.paid = order.paidOn.split('T')[0] // keep only date part
      const dateParts = order.paid.split('-')
      order.period = (dateParts[0] + dateParts[1]).toString()
      order.year = parseInt(dateParts[0])
      order.month = parseInt(dateParts[1])

      delete order.reference
      delete order.amountInEuro
      delete order.instrument
      delete order.quantity
      delete order.grossAmountPerShare
      delete order.paidOn

      return order
    }).sort((a, b) => new Date(a.paid) - new Date(b.paid))
  
  const periodMap = new Map()

  // Pad YYYYMM periods with no dividends to zero totals
  const startYear = dividends[0].year
  const endYear = dividends[dividends.length - 1].year
  const startMonth = dividends[0].month
  const endMonth = dividends[dividends.length - 1].month

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 1
    const monthEnd = year === endYear ? endMonth : 12

    for (let month = monthStart; month <= monthEnd; month++) {
      const period = `${year}${month.toString().padStart(2, '0')}`
      periodMap.set(period, periodMap.get(period) ?? [])
    }
  }

  dividends.forEach((order) => {
    const period = order.period
    periodMap.get(period).push(order)
  })

  let runningTotal = 0.0
  const periodTotals = Array.from(periodMap.entries()).map(([period, orders]) => {
    const total = +orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)
    runningTotal += total
    return { period, total, runningTotal: +runningTotal.toFixed(2) }
  })

  return { dividends, periodTotals, grandDividendTotal: +runningTotal.toFixed(2) }
}

export const AccountSummary = async (t212Key) => {
  const accountSummaryPath = `/api/v0/equity/account/summary`

  const response = await fetch(`${T212_HOST2}${accountSummaryPath}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${t212Key}` },
    })

    const data = await response.json()

    return data;
}

export const TransactionHistory = async (t212Key) => {
  const query = new URLSearchParams({
    cursor: 'string',
    time: '2025-01-01T00:00:00Z',
    limit: '21'
  }).toString();

  //const transactionHistoryPath = `/api/v0/equity/history/transactions?${query}`
  const transactionHistoryPath = `/api/v0/equity/history/transactions?limit=50`
  
  const response = await fetch(`${T212_HOST2}${transactionHistoryPath}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${t212Key}` },
    })

    const data = await response.json()

    return data;
}
