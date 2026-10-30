# Parte A

## A1. ¿Por qué MongoDB aquí?

1. **Atributos variables:** Evita múltiples columnas NULL (como ocurriría en SQL con 13+ atributos de diferentes categorías) y permite añadir nuevos atributos o categorías sin modificar el esquema.

2. **Modelo flexible:** Cada categoría y anuncio almacena sus propios campos dentro de atributos (ej. móviles, muebles).

## A2. Anuncio y vendedor
1. **No se embebe al usuario completo:** Tiene entidad propia y se relaciona con múltiples anuncios; duplicarla dificultaría las actualizaciones.

2. **Nombre copiado:** Se almacena el nombre del vendedor en el anuncio para mostrar la ficha en una sola lectura, sin datos personales mutables (email/ciudad).

3. **Actualización:** Al cambiar el nombre del vendedor, debe actualizarse en sus anuncios y ofertas.

4. **Comparativa SQL:** En SQL requiere un JOIN; en MongoDB se lee directamente con la copia desnormalizada.

## A3. Ofertas
1. **Colección aparte:** Un anuncio recibe muchas ofertas y el comprador consulta las suyas. Embeberlas superaría límites de tamaño y dificultaría consultas.

2. **Estructura:** Referencia al anuncio, comprador, importe, estado y fecha.

3. **Precio histórico:** Guarda el precio del anuncio al momento de la oferta para conservar el contexto histórico frente a cambios posteriores.

## A4. Valoraciones
1. **Colección aparte:** Evita arrays en crecimiento ilimitado dentro de usuarios y permite consultar/indexar por autor y anuncio.

2. **Índice único compuesto:** { autor.id: 1, anuncioId: 1 } para impedir valoraciones duplicadas del mismo usuario en un anuncio.

3. **Resumen en usuario:** Almacena valoracionMedia y numValoraciones para consultarlas instantáneamente.

## A5. Favoritos
1. **Escala:** Un usuario tiene pocos favoritos, pero un anuncio popular tendría miles (superando los límites de un documento si se embebieran usuarios).

2. **Estrategia:** Guardar un array de IDs de anuncios en cada usuario (usuario.favoritos).

3. **Operaciones:** Uso de $addToSet para evitar duplicados y consultas inversas por ID.

## A6. ¿Dentro o aparte?
1. **Mensajes de chat:** Aparte (historial creciente y paginable).

2. **Dirección de envío:** Embebida en la compra (copia histórica inalterable).

3. **Etiquetas:** Embebidas en el anuncio (array pequeño, lectura conjunta).

4. **Categorías:** Aparte (compartidas e independientes).

5. **Historial de precios:** Aparte (creciente y consultado por fechas).

6. **Anuncios del usuario:** Aparte (vida propia, con referencia al vendedor).

7. **Líneas de pedido:** Embebidas (parte indivisible del pedido).

8. **Reseñas de producto:** Aparte (crecen indefinidamente).

## Apartado 9. Diferencias con el modelo propuesto

Coincide con el modelo base: colecciones separadas para usuarios, anuncios, ofertas y valoraciones; fotos y atributos embebidos; nombre de vendedor desnormalizado; favoritos en array de usuario.

---

# Parte B — respuestas escritas

## B2.3
MongoDB permite esquemas flexibles, por lo que añadir una categoría nueva (ej. Deporte) no requiere alterar tablas ni columnas previas como en SQL.

## B4. Predicciones, resultados y explicación
- **B4.1 (Email duplicado):** Falla (E11000) por el índice único en email.

- **B4.2 (Valoración duplicada):** Falla (E11000) por el índice único compuesto (autor.id + anuncioId).

- **B4.3 (Vendedor inexistente):** Se inserta sin error; MongoDB no valida referencias automáticamente.

- **B4.4 (Precio como texto):** Se inserta, pero la consulta numérica $lt no lo encuentra por tipado estricto.

- **B4.5 (Update sin operador):** Falla al requerir operadores atómicos como $set.

- **B4.6 (Id como texto):** Devuelve null al comparar un string con un ObjectId.

- **B4.7 (Integridad referencial):** A diferencia de SQL, MongoDB no aplica restricciones de clave ajena por defecto; la aplicación debe validarlas.

- **B4.8 (Tipado en consultas):** El filtrado numérico falla si el valor está guardado como cadena de texto.

- **B4.9 (Validación):** Sin validadores de esquema, MongoDB acepta datos mal tipados o huérfanos.

## B5.12

Los documentos sin el campo consultado (ej. atributos.km) simplemente no cumplen el filtro y son omitidos sin generar errores.

## B8. Explícalo con tus palabras

1. **Por qué MongoDB:** Ideal para datos semiestructurados con atributos variables por categoría y lectura rápida en un solo documento.

2. **Cuándo usar SQL:** Para datos estrictos y altamente relacionados (pagos, finanzas) que exigen transacciones y restricciones rígidas.

3. **Embebido vs Aparte:** Embeber datos estables o pequeños que se leen juntos (fotos, líneas); separar colecciones si crecen indefinidamente o tienen vida propia (ofertas, reseñas).

4. **Contexto histórico:** Las ofertas o pedidos congelan el precio/datos del momento para no verse alterados por futuros cambios.

5. **Desnormalización:** Copiar datos clave (ej. nombre de vendedor) para evitar JOINs, gestionando las actualizaciones necesarias.

6. **Ausencia de FKs:** MongoDB deja la integridad referencial en manos de la aplicación o validadores de esquema.
