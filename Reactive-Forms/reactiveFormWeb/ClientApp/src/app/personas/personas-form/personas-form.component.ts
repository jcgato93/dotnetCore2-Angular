import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IPersona } from '../persona';
import { PersonasService } from '../personas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DireccionesService } from '../../direcciones/direcciones.service';

@Component({
  selector: 'app-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.css']
})
export class PersonasFormComponent implements OnInit {

  constructor(private fb: FormBuilder,//manejo de los formularios
    private personasService: PersonasService, //servicios personas
    private direccionesService: DireccionesService, // servicios Direcciones
    private router: Router, // Manejo de rutas , para navegar 
    private activatedRoute: ActivatedRoute //para manejo de las propiedades de la ruta actual, parametros , etc..
   ) { }


  modoEdicion: boolean = false;
  formGroup: FormGroup;
  personaId: number;
  direccionesABorrar: number[] = [];
  ignorarExistenCambiosPendientes: boolean = false;

  existenCambiosPendientes(): boolean {
    if (this.ignorarExistenCambiosPendientes) { return false; };
    return !this.formGroup.pristine;//pristine evalua si el formulario ha sido modificado
  }

  ngOnInit() {
    //el formBuilder permite construir el modelo del formulario
    this.formGroup = this.fb.group({
      nombre: '',
      fechaNacimiento: '',
      direcciones: this.fb.array([])//indicar que sera un numero variable de elementos
    });

    this.activatedRoute.params.subscribe(params => {
      if (params["id"] == undefined) {
        return;
      }

      this.modoEdicion = true;

      this.personaId = params["id"];

      this.personasService.getPersona(this.personaId.toString())
        .subscribe(persona => this.cargarFormulario(persona),
          error => this.router.navigate(["/personas"]));

    });

  }

  agregarDireccion() {
    let direccionArr = this.formGroup.get('direcciones') as FormArray;//casteo como arreglo de formularios
    let direccionFG = this.construirDireccion();//crea un nuevo form group
    direccionArr.push(direccionFG);//agregar el form group al array de formularios
  }

  construirDireccion() {
    return this.fb.group({
      id: '0',
      calle: '',
      provincia: '',
      personaId: this.personaId != null ? this.personaId : 0 //como se utiliza el mismo formulario para insertar y actualizar , primero evalua si personaId tiene un valor
    });
  }

  removerDireccion(index: number) {
    let direcciones = this.formGroup.get('direcciones') as FormArray;
    let direccionRemover = direcciones.at(index) as FormGroup;
    if (direccionRemover.controls['id'].value != '0') {
      this.direccionesABorrar.push(<number>direccionRemover.controls['id'].value);
    }
    direcciones.removeAt(index);
  }

  cargarFormulario(persona: IPersona) {

    var dp = new DatePipe(navigator.language);
    var format = "yyyy-MM-dd";

    this.formGroup.patchValue({//patchValue , permite pasar los valores al formulario
      nombre: persona.nombre,
      fechaNacimiento: dp.transform(persona.fechaNacimiento, format)//parsear la fecha
    });

    let direcciones = this.formGroup.controls['direcciones'] as FormArray;
    persona.direcciones.forEach(direccion => {
      let direccionFG = this.construirDireccion();
      direccionFG.patchValue(direccion);
      direcciones.push(direccionFG);
    });
  }

  save() {
    this.ignorarExistenCambiosPendientes = true;//evita el promt de confirmacion de cambios del formulario
    let persona: IPersona = Object.assign({}, this.formGroup.value);//este metodo crea un objeto tipo persona apartir del formulario
    console.table(persona);

    if (this.modoEdicion) {
       // editar el registro
      persona.id = this.personaId;
      this.personasService.updatePersona(persona)
        .subscribe(persona => this.borrarPersonas(),
          error => console.error(error));
    } else {
      // agregar el registro
    
    this.personasService.createPersona(persona)
      .subscribe(persona => this.onSaveSuccess(),
        error => console.error(error));
    }
  }

  borrarPersonas() {
    if (this.direccionesABorrar.length === 0) {
      this.onSaveSuccess();
      return;
    }

    this.direccionesService.deleteDirecciones(this.direccionesABorrar)
      .subscribe(() => this.onSaveSuccess(),
        error => console.error(error));
  }

  onSaveSuccess() {
    this.router.navigate(["/personas"]);
  }

}
