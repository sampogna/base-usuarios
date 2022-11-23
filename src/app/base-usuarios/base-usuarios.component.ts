import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from './usuario.model';

@Component({
  selector: 'base-usuarios',
  templateUrl: './base-usuarios.component.html',
  styleUrls: ['./base-usuarios.component.scss']
})
export class BaseUsuariosComponent implements AfterViewInit {

  displayedColumns: string[] = ['cod', 'nome', 'telefone', 'acoes'];
  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatTable) table: MatTable<Usuario> | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  increment: number = 1;

  usuTableData: Usuario[] = [];

  userValidations!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource(this.usuTableData);
   }

  ngOnInit(): void {
    this.userValidations = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')]],
      telefone: ['', [Validators.required]]
    });
  }

  ngAfterViewInit() {
    if (this.dataSource.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  addUser() {
    if (this.userValidations.valid) {
      let usu: Usuario = new Usuario(this.increment, this.userValidations.controls['nome'].value, this.userValidations.controls['telefone'].value);
      console.log()
      this.usuTableData.push(usu);
      this.increment++;
      if (this.table) {
        this.table.renderRows();
      }
      this.toastr.success('Usuário adicionado.')
    }
  }

  cleanUsers() {
    this.dataSource.data = [];
    if (this.table) {
      this.table.renderRows();
    }
    this.toastr.success('Base de usuários limpa.')
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteFieldValue(index: any) {
    this.usuTableData.splice(index, 1);
    if (this.table) {
      this.table.renderRows();
    }
    this.toastr.success('registro deletado.')
  }

}
