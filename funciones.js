const joyas = require('./data/joyas.js')
const HATEOASV1 = () => 
joyas.results.map((j) => {
  return {
    name: j.name,
    href: `http://localhost:3000/api/v1/joya/${j.id}`
  }
})

const HATEOASV2 = () => 
  joyas.results.map((j) => {
    return {
      nombre: j.name,
      link_detalle: `http://localhost:3000/api/v2/joya/${j.id}`
    }
})


const joyaIndividual = (id) => {
  return joyas.results.find((j) => j.id == id)
}

const filterByCategory = (category) => {
  return joyas.results.filter((j) => j.category == category)
}

const orderValues = (order) => {
  return order == "asc"
    ? joyas.results.sort((a,b) => (a.value > b.value ? 1 : -1))
    : order == "desc"
    ? joyas.results.sort((a,b) => (a.value < b.value ? 1 : -1))
    : false
}

module.exports = {HATEOASV1, HATEOASV2, joyaIndividual, filterByCategory, orderValues}