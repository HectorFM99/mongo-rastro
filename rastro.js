// use rastro

// Ejercicio B2 
db.anuncios.insertOne({
  titulo: "Bicicleta de montaña Orbea",
  descripcion: "Revisada en taller.",
  precio: 300,
  categoria: "Deporte",
  estado: "DISPONIBLE",
  ciudad: "Castellón",
  fechaPublicacion: new Date("2026-10-27"),
  visitas: 0,
  vendedor: {
    id: ObjectId("660000000000000000000004"),
    nombre: "Hugo Sanz"
  },
  fotos: [{ url: "https://img.rastro.es/bici-1.jpg", orden: 1 }],
  atributos: { talla: "L", tipo: "montaña", pulgadasRueda: 29 }
})


db.anuncios.insertOne({
  titulo: "Google Pixel 7",
  descripcion: "Libre, con caja.",
  precio: 260,
  categoria: "Móviles",
  estado: "DISPONIBLE",
  ciudad: "Valencia",
  fechaPublicacion: new Date("2026-10-28"),
  visitas: 0,
  vendedor: {
    id: ObjectId("660000000000000000000005"),
    nombre: "Sara López"
  },
  fotos: [
    { url: "https://img.rastro.es/pixel-1.jpg", orden: 1 },
    { url: "https://img.rastro.es/pixel-2.jpg", orden: 2 }
  ],
  atributos: { marca: "Google", modelo: "Pixel 7", almacenamientoGB: 128, bateriaPct: 92 }
})

// Ejercicio B3 — Índices

db.usuarios.createIndex({ email: 1 }, { unique: true })


db.valoraciones.createIndex(
  { "autor.id": 1, anuncioId: 1 },
  { unique: true }
)


db.anuncios.createIndex({ categoria: 1, precio: 1 })


db.usuarios.getIndexes()
db.valoraciones.getIndexes()
db.anuncios.getIndexes()


db.anuncios
  .find({ categoria: "Coches" })
  .sort({ precio: 1 })
  .explain("executionStats")

// Ejercicio B4

db.usuarios.insertOne({
  nombre: "Ana Copia",
  email: "ana@rastro.es",
  ciudad: "Valencia",
  fechaAlta: new Date(),
  favoritos: [],
  valoracionMedia: 0,
  numValoraciones: 0
})

// B4.2
db.valoraciones.insertOne({
  anuncioId: ObjectId("670000000000000000000004"),
  autor: { id: ObjectId("660000000000000000000004"), nombre: "Hugo Sanz" },
  valoradoId: ObjectId("660000000000000000000003"),
  estrellas: 1,
  comentario: "Cambio de opinión",
  fecha: new Date()
})

// B4.3
db.anuncios.insertOne({
  titulo: "Prueba fantasma",
  precio: 10,
  categoria: "Libros",
  estado: "DISPONIBLE",
  ciudad: "Valencia",
  fechaPublicacion: new Date(),
  visitas: 0,
  vendedor: { id: ObjectId("660000000000000000000099"), nombre: "Nadie" },
  fotos: [],
  atributos: {}
})

// B4.4
db.anuncios.insertOne({
  titulo: "Prueba lámpara",
  precio: "75",
  categoria: "Muebles",
  estado: "DISPONIBLE",
  ciudad: "Valencia",
  fechaPublicacion: new Date(),
  visitas: 0,
  vendedor: { id: ObjectId("660000000000000000000001"), nombre: "Ana García" },
  fotos: [],
  atributos: { material: "metal" }
})


db.anuncios.find(
  { precio: { $lt: 100 } },
  { titulo: 1, precio: 1, _id: 0 }
)

// B4.5
db.anuncios.updateOne(
  { _id: ObjectId("670000000000000000000005") },
  { precio: 80 }
)

// B4.6
db.anuncios.findOne({ _id: "670000000000000000000003" })


db.anuncios.deleteMany({ titulo: /^Prueba/ })

// Ejercicio B5
db.anuncios.find(
  { estado: "DISPONIBLE", ciudad: "Valencia" },
  { titulo: 1, precio: 1, _id: 0 }
).sort({ precio: 1 })

// B5.2
db.anuncios.find({ categoria: "Coches", "atributos.km": { $lt: 100000 } })

// B5.3
db.anuncios.find({ categoria: "Móviles", "atributos.almacenamientoGB": { $gte: 128 } })

// B5.4
db.anuncios.find({ precio: { $gte: 50, $lte: 400 } })

// B5.5
db.anuncios.find({ titulo: /nike/i })

// B5.6
db.anuncios.find({ "vendedor.id": ObjectId("660000000000000000000002") })

// B5.7
db.anuncios.find({ fotos: { $size: 0 } })

// B5.8
db.ofertas.find({ "anuncio.id": ObjectId("670000000000000000000001"), estado: "PENDIENTE" })

// B5.9
db.usuarios.find(
  { favoritos: ObjectId("670000000000000000000008") },
  { nombre: 1, _id: 0 }
)

// B5.10
db.anuncios.countDocuments({ estado: "VENDIDO" })

// B5.11
db.anuncios.find({}, { titulo: 1, visitas: 1, _id: 0 }).sort({ visitas: -1 }).limit(3)

// Ejercicio B6

// B6.1
db.anuncios.aggregate([
  { $group: { _id: "$categoria", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
])

// B6.2
db.anuncios.aggregate([
  { $group: { _id: "$categoria", precioMedio: { $avg: "$precio" } } },
  { $sort: { _id: 1 } }
])

// B6.3
db.anuncios.aggregate([
  { $group: { _id: "$ciudad", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
])

// B6.4
db.anuncios.aggregate([
  { $match: { estado: "DISPONIBLE" } },
  {
    $group: {
      _id: "$vendedor.nombre",
      valorEnVenta: { $sum: "$precio" }
    }
  },
  { $sort: { valorEnVenta: -1 } }
])

// B6.5
db.anuncios.aggregate([
  { $group: { _id: "$categoria", visitasTotales: { $sum: "$visitas" } } },
  { $sort: { visitasTotales: -1 } },
  { $limit: 1 }
])

// Ejercicio B7

// B7.1
db.anuncios.updateOne(
  { _id: ObjectId("670000000000000000000003") },
  { $push: { fotos: { url: "https://img.rastro.es/a3-4.jpg", orden: 4 } } }
)

// B7.2
db.anuncios.updateOne(
  { _id: ObjectId("670000000000000000000005") },
  { $inc: { visitas: 1 } }
)

// B7.3
db.usuarios.updateOne(
  { _id: ObjectId("660000000000000000000005") },
  { $pull: { favoritos: ObjectId("670000000000000000000003") } }
)
db.usuarios.updateOne(
  { _id: ObjectId("660000000000000000000005") },
  { $addToSet: { favoritos: ObjectId("670000000000000000000002") } }
)


db.usuarios.updateOne(
  { _id: ObjectId("660000000000000000000005") },
  { $addToSet: { favoritos: ObjectId("670000000000000000000002") } }
)

// B7.4
db.ofertas.updateOne(
  { _id: ObjectId("680000000000000000000003") },
  { $set: { estado: "ACEPTADA" } }
)
db.anuncios.updateOne(
  { _id: ObjectId("670000000000000000000001") },
  { $set: { estado: "RESERVADO" } }
)

// B7.5
db.anuncios.updateMany(
  { categoria: "Coches" },
  { $mul: { precio: 0.9 } }
)

// B7.6
db.usuarios.updateOne(
  { _id: ObjectId("660000000000000000000002") },
  { $set: { nombre: "Luis M. Martín" } }
)


db.anuncios.updateMany(
  { "vendedor.id": ObjectId("660000000000000000000002") },
  { $set: { "vendedor.nombre": "Luis M. Martín" } }
)


db.ofertas.updateMany(
  { "comprador.id": ObjectId("660000000000000000000002") },
  { $set: { "comprador.nombre": "Luis M. Martín" } }
)


db.valoraciones.updateMany(
  { "autor.id": ObjectId("660000000000000000000002") },
  { $set: { "autor.nombre": "Luis M. Martín" } }
)
