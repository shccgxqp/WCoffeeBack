const processHelpers = {
  processOrderHandler(orders) {
    const data = []
    const indexMap = new Map()

    orders.forEach(order => {
      const orderId = order.id
      const orderData = {
        id: order.id,
        sub_total: order.sub_total,
        total: order.total,
        status: order.status,
        comments: order.comments,
        payment_status: order.payment_status,
        payment_type: order.payment_type,
        payment_bank: order.payment_bank,
        payment_act: order.payment_act,
        created_at: order.created_at,
        updated_at: order.updated_at,
        Shipment: [
          {
            address: order['Shipment.address'],
            city: order['Shipment.city'],
            state: order['Shipment.state'],
            country: order['Shipment.country'],
            zip_code: order['Shipment.zip_code'],
          },
        ],
        OrderItemsProduct: [
          {
            name: order['OrderItemsProduct.name'],
            price: order['OrderItemsProduct.price'],
            weight: order['OrderItemsProduct.weight'],
            roast: order['OrderItemsProduct.roast'],
            image: order['OrderItemsProduct.image'],
            qty: order['OrderItemsProduct.OrderItems.qty'],
          },
        ],
      }
      if (order['User.name']) orderData['UserName'] = order['User.name']
      if (order['User.email']) orderData['UserEmail'] = order['User.email']

      if (indexMap.has(orderId)) {
        const index = indexMap.get(orderId)
        data[index].OrderItemsProduct.push(orderData.OrderItemsProduct[0])
      } else {
        data.push(orderData)
        indexMap.set(orderId, data.length - 1)
      }
    })

    return data
  },
  processProductsHandler(products) {
    const data = products.map(product => ({
      id: product.id,
      name: product.name,
      Category: product['Category.name'],
      Origin: product['Origin.name'],
      Unit: product['Unit.name'],
      price: product.price,
      weight: product.weight,
      roast: product.roast,
      image: product.image,
      description: product.description,
    }))
    return data
  },
}

module.exports = processHelpers
