import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PersonasFormComponent } from './personas-form.component';

@Injectable()
export class LeaveFormService implements CanDeactivate<PersonasFormComponent> {

  //define si realmente debe poder salir del componente en el que se encuentra
  //true si puede salir
  //false si no puede salir
  canDeactivate(component: PersonasFormComponent): boolean {
    if (component.existenCambiosPendientes()) {
      return confirm("Tiene cambios pendientes, ¿Desea salir de todos modos?");
    }
    return true;
  }
  constructor() { }

}
