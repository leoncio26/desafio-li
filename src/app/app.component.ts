import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Produto } from './models/produto';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fabricantes = [{id: -1, nome: ''},{id: 1, nome: 'Fabricante1'}, {id: 2, nome: 'Fabricante2'}];
  categorias = [{id: 1, nome: 'Categoria 1 Fabricante1', fabricanteId: 1},{id: 2, nome: 'Categoria 2 Fabricante1', fabricanteId: 1}, 
    {id: 3, nome: 'Categoria 2 Fabricante2', fabricanteId: 2}];
  categoriasFabricante = [];
  produtosSalvos: Produto[] = [];
  produtos: Produto[] = [];
  produtoId = 1;
  produtoSelecionado: Produto;
  showModal = false;
  isEditing = false;
  quantidadeTotal = 0;
  total = 0;

  form: FormGroup;
  formFilter: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: '',
      fabricante: '',
      categoria: '',
      quantidade: '',
      valorUnitario: '',
    });

    this.formFilter = this.fb.group({
      filtro: '',
    });
  }

  onCancel($event){
    event.preventDefault();
  }

  onSubmit(form){
    const fabricante = this.fabricantes.find(f => f.id == form.fabricante);
    const categoria = this.categorias.find(c => c.id == form.categoria);

    if(this.isEditing){
      //const produtoExistente = this.produtos.find(p => p.id == this.produtoSelecionado.id);
      const indiceProduto = this.produtos.findIndex(p => p.id == this.produtoSelecionado.id);
      this.produtosSalvos[indiceProduto] = {
        id: this.produtoSelecionado.id,
        nome: form.nome,
        fabricante: fabricante,
        categoria: categoria,
        quantidade: form.quantidade,
        valorUnitario: form.valorUnitario
      }
      this.isEditing = false;
    }else{
      this.produtosSalvos.push({
        id: this.produtoId++,
        nome: form.nome,
        fabricante: fabricante,
        categoria: categoria,
        quantidade: form.quantidade,
        valorUnitario: form.valorUnitario
      });
    }
    if(this.produtos.length == 0) this.produtos = this.produtosSalvos;
    this.calcularTotais();
    this.form.reset();
  }

  filtrar(form){
    this.produtos = this.produtosSalvos.filter(p => p.nome.includes(form.filtro.toLowerCase()));
    if(form.filtro == ""){
      this.produtos = this.produtosSalvos;
    }
    this.calcularTotais();
  }

  mudarCategoria(fabricanteId){
    this.categoriasFabricante = this.categorias.filter(categoria => categoria.fabricanteId == fabricanteId);
    //console.log(this.categoriasFabricante);
  }

  deletarProduto(id){
    const produtoId = this.produtos.findIndex(p => p.id == id);

    console.log(id);

    if(produtoId != -1){
      this.produtos.splice(produtoId,1);
    }
  }

  editarProduto(produto){
    this.produtoSelecionado = produto;
    this.showModal = true;
    console.log(this.produtoSelecionado);

    this.isEditing = true;

    this.form.controls['nome'].setValue(this.produtoSelecionado.nome);
    this.form.controls['fabricante'].setValue(this.produtoSelecionado.fabricante.id);
    this.form.controls['categoria'].setValue(this.produtoSelecionado.categoria.id);
    this.form.controls['quantidade'].setValue(this.produtoSelecionado.quantidade);
    this.form.controls['valorUnitario'].setValue(this.produtoSelecionado.valorUnitario);
  }

  calcularTotais(){
    this.quantidadeTotal = 0;
    this.total = 0;
    this.produtos.forEach(p => {
      this.quantidadeTotal += Number(p.quantidade);
      this.total += p.quantidade * p.valorUnitario;
    })
  }
}
