import { Categoria } from "./categoria";
import { Fabricante } from "./fabricante";

export interface Produto{
  id: number;
  nome: string;
  fabricante: Fabricante;
  categoria: Categoria;
  quantidade: number;
  valorUnitario: number;
}