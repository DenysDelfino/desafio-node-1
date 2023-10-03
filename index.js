const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())
const pedido = []


const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = pedido.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "User not found"})
    }

    request.pedidoIndex = index
    request.pedidoId = id

    next()
}

const checkUrl = (request, response, next) => {
console.log(request.method)
console.log(request.url)

next()

}


app.get('/order', (request, response) => {
        return response.json(pedido)
})

app.post('/order', checkUrl,(request, response) => {
    const { order, clientName, price } = request.body

    const client = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    pedido.push(client)
    
    return response.status(201).json(client)
})

app.put('/order/:id', checkOrderId, (request, response) => {

    const { order, clientName, price, status} = request.body
    const index = request.pedidoIndex
    const id = request.pedidoId

    const updateOrder = { id, order, clientName, price, status}
    

    /*if(index < 0){
        return response.status(404).json({message:" Order not found"})
    }*/
    
    pedido[index] = updateOrder

    return response.json(updateOrder)
})


app.get('/order/:id', checkOrderId, (request, response) => {

    const id = request.pedidoId
    const index = request.pedidoIndex

    return response.status(201).json(pedido[index])
})

app.delete('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.pedidoIndex

    pedido.splice(index, 1)
    
    return response.status(204).json()
})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const id = request.pedidoId
    const index = request.pedidoIndex

    const {status} = request.body
    
    return response.status(201).json(pedido[index])
    
})



    
 


app.listen(port, () => {
    console.log(`🍔 Server started on port ${port}`)
})