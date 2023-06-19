const express = require("express")
const port = 3000

const uuid = require("uuid")
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id
    request.ordersDetails = orders

    next()
}

const method = (request, response, next) =>{
    console.log(request.method);

    next()
}

app.get('/orders',method, (request, response) => {

    console.log(app)
    return response.status(201).json(orders)
})

app.post('/orders', method, (request, response) => {
    const { newOrder, clientName, price, } = request.body

    const order = { id: uuid.v4(), newOrder, clientName, price, status: "Em preparação" }

    orders.push(order)
    return response.status(201).json(order)
})

app.put('/orders/:id', checkOrderId, method, (request, response) => {
    const { newOrder, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = { id, newOrder, clientName, price, status: "Em preparação" }
    orders[index] = updateOrder
    return response.status(201).json(updateOrder)
})

app.patch('/orders/:id', checkOrderId, method, (request, response) => { 
    const index = request.orderIndex
    const { id, clientName, newOrder, price } = orders[index]
    let status = orders[index].status
    status = "Pronto"
    const orderReady = { id, clientName, newOrder, price, status }
    orders[index] = orderReady
    return response.status(201).json(orderReady)
})

app.delete('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(201).json({ message: "Order Deleted" })
})

app.listen(port, () => {
    console.log(`🚀Server started on port ${port}`)
})
