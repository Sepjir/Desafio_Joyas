const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()
const {HATEOASV1, HATEOASV2, joyaIndividual, filterByCategory, orderValues} = require("./funciones")

//Ruta raíz
app.get('/', (req, res) => {
  res.send(joyas)
})

//Ruta para consultar todas las joyas con HATEOAS
app.get("/api/v1/joyas", (req, res) => {
  res.send({
    Cantidad: joyas.results.length,
    joyas: HATEOASV1()
  })
})

//Ruta para consultar todas las joyas en su V2, con parametros "Values" para ordenar ascendiente y descendiente de acuerdo a su valor, y "Page" para paginación
app.get("/api/v2/joyas", (req, res) => {
  const {values} = req.query
  if (values == "asc") return res.send(orderValues("asc"))
  if (values == "desc") return res.send(orderValues("desc"))

  if(req.query.page) {
    const {page} = req.query
    return res.send({joyas: HATEOASV2().slice(page * 2 - 2, page * 2)})
  }
  
  res.send({
    total_joyas: joyas.results.length,
    joyas: HATEOASV2()
  })
})

//Ruta que consulta la ID en su V1, con manejo de errores si no existe la ID de la joya
app.get("/api/v1/joya/:id", (req, res) => {
  const {id} = req.params
  const imprimirJoya = joyaIndividual(id)
  id <= joyas.results.length
    ? res.send(imprimirJoya)
    : res.status(404).send({
      error: "Not Found",
      message: `El id '${id}' no existe`,
    })
})

//Ruta que consulta la ID en su V2, con manejo de errores si no existe la ID de la joya
app.get("/api/v2/joya/:id", (req, res) => {
  const {id} = req.params
  const imprimirJoya = joyaIndividual(id)
  id <= joyas.results.length
    ? res.send(imprimirJoya)
    : res.status(404).send({
      error: "Not Found",
      message: `El id '${id}' no existe`
    })
})

//Ruta para filtrar por categorias cada joya y si no existe, indicarlo
//categorias: "/collar", "/aros", "/anillo"
app.get("/api/v2/category/:category", (req, res) => {
  const {category} = req.params
  const filtro = filterByCategory(category)
  
  filtro.length !== 0
    ?res.send({
    cantidad: filtro.length,
    joyas: filtro
  })
    :res.status(404).send({
      error: "Not Found",
      message: `La categoría '${category}' no existe`
    })
  
})

//Ruta generica para enviar si hay errores al escribir los endpoints.
app.get("*", (req, res) => {
  res.status(404).send({
    error: "Not Found",
    message: `La dirección que intentas acceder no existe, prueba con la ruta raíz`,
    ruta_raiz_API: "http://localhost:3000/api/v2/joyas"
  })
})


//Escuchando el servidor en el puerto 3000
app.listen(3000, () => console.log('Servidor levantado en puerto 3000'))
