const T212_HOST = `https://live.trading212.com/api/v0`

export const OpenOrders = async (t212Key) => {
  const response = await fetch(`${T212_HOST}/equity/orders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${t212Key}` },
  })
  return await response.json()
}

export const OpenOrders2 = async (t212Key) => {
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

    order.createdAt = order.createdAt.split("T")[0]; // keep only date part
    // reduce object noise
    delete order.id
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
