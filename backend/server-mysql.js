import { createApp } from "./app.mjs";
import { ProductoModel } from "./models/producto.js";
import { MarcaModel } from "./models/marca.js"
import { CategoriaModel } from "./models/categoria.js"
import { UsuarioModel } from "./models/usuario.js";
import { VentaModel } from "./models/venta.js";
import { DashboardModel } from "./models/dashboard.js";

createApp({
    productoModel: ProductoModel,
    marcaModel: MarcaModel,
    categoriaModel: CategoriaModel,
    usuarioModel: UsuarioModel,
    ventaModel: VentaModel,
    dashboardModel: DashboardModel
});