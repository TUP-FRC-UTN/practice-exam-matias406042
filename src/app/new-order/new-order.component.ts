import { Component, inject, NgModule, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Producto } from '../../models/product';
import { ServiceMockService } from '../service-mock.service';
import { catchError, count, from, map, Observable, of } from 'rxjs';
import { CommonModule, JsonPipe } from '@angular/common';
import { Order, ProductOrder } from '../../models/order';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent implements OnInit {
  
  constructor(private service: ServiceMockService) {} 

  productosDisponibles:Producto[]= [];
  orden= new Order()

  formulario: FormGroup = new FormGroup({});

  ngOnInit(): void {

    this.loadProductosDisponibles()
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required,Validators.minLength(3)]),
      email: new FormControl('', [Validators.required ,Validators.email],this.ordersMax()),
      total: new FormControl({ value: 0, disabled: true }),
      productosSeleccionados: new FormArray([], [Validators.min(1),this.validateUniqueProduct(),Validators.required,this.validateSelected()], []) 
    },[]);
  }

  ordersMax(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value.length > 5) {
        return this.service.getByEmail(control.value).pipe(
          map((data: Order[]) => {
            const now = new Date();
            const recentOrders = data.filter((order) => {
              if (order.timestamp) {
                const diff = now.getTime() - new Date(order.timestamp).getTime();
                const hours = diff / (1000 * 60 * 60); // convertir ms a horas
                return hours <= 24; // Cambia 24 por el número de horas que deseas verificar
              }
              return false;
            });
  
            // Verifica si el usuario tiene más de X órdenes en el rango de tiempo deseado
            return recentOrders.length >= 3
              ? { maxOrdersExceeded: true }
              : null;
          }),
          catchError((error) => {
            console.error(error);
            return of(null); // Si ocurre un error, no devuelve error de validación
          })
        );
      }
      // Si el valor no cumple con la longitud mínima, no valida (retorna observable vacío)
      return of(null);
    };
  }
  logErrors(form: FormGroup) {
    const productosSeleccionados = form.get('productosSeleccionados') as FormArray;
  
    productosSeleccionados.controls.forEach((control, index) => {
      const selectedProductControl = control.get('selectedProduct');
  
      if (selectedProductControl?.errors) {
        console.log(`Errores en el control selectedProduct del producto ${index + 1}:`, selectedProductControl.errors);
      }
      else{console.log("no hay error ")}
    });
  }

  sendForm() {
      if (this.formulario.valid) {
        // this.enviadoEmit.emit(this.prog);
        // this.progService.addPush(this.prog);
    console.log(this.formulario.value)
        this.orden.customerName= this.formulario.get('nombre')?.value;
        this.orden.email=this.formulario.get('email')?.value;
        this.orden.timestamp= new Date();
        const productosOrder: any[] = []
        console.log("itasdqwqqwems:"+ JSON.stringify(this.formulario.get('productosSeleccionados')?.value))
        this.formulario.get('productosSeleccionados')?.value.forEach((e : any) => { 
           const p = this.productosDisponibles.find(p => p.name === e.selectedProduct)
           const pOrder = new ProductOrder();
           pOrder.productId = p?.id;
           pOrder.price= p?.price
           pOrder.quantity= e.cantidad
           pOrder.stock= p?.stock
           productosOrder.push(pOrder)
          console.log(p)
        });
        
        this.orden.products= productosOrder
        this.orden.total= this.formulario.get('total')?.value
        console.log("paso"+JSON.stringify(this.formulario.get('productosSeleccionados')?.value))
            this.service.post(this.orden).subscribe({
              next:(data) => {console.log(data),alert("orden creada" + data) },
                           
              error: (errr) => alert("Error al crear orden."+errr.message),
             // complete: () => this.router.navigate(['list'])           
           })
      }
    }
    

  // Getter para productosSeleccionados FormArray
  get productosSeleccionados(): FormArray {
    return this.formulario.get('productosSeleccionados') as FormArray;
  }

  eliminarProducto(id?:number){
    
    if(id == null) return;
    this.productosSeleccionados.removeAt(id)
    this.calcularTotal()
    
  }
  
  // Método para agregar un producto al FormArray de productos
  agregarProducto() {
    const productoGroup = new FormGroup({
      selectedProduct: new FormControl("",[Validators.required]),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)]),
      precio: new FormControl(0),
      stock: new FormControl(0)
    });
    console.log("ESTRES"+ productoGroup.get('selectedProduct')?.value+"|")
    console.log("aaaaaaaaaaa"+JSON.stringify(productoGroup?.value))
    // Manejar cambios en la selección del producto
    productoGroup.get('selectedProduct')?.valueChanges.subscribe((name) => {

      console.log(productoGroup.get('selectedProduct'))
      const producto = this.productosDisponibles.find(p => p.name === name);
      if (producto && producto.price && producto.stock) {
        productoGroup.get('precio')?.setValue(producto.price);
        productoGroup.get('stock')?.setValue(producto.stock);
        productoGroup.get('cantidad')?.valueChanges.subscribe((x)=> {this.calcularTotal()})
       
      }
      this.calcularTotal();
    });
  
    this.productosSeleccionados.push(productoGroup);
    console.log("items::"+ JSON.stringify(this.formulario.get('productosSeleccionados')?.value))

  }


  // Validador personalizado para el select
  // Validador modificado para el select
  noSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Verificamos si el valor es null, undefined, vacío o "Seleccione"
      const value = control.value;
      if (!value || value === "" ) {
       const si = true
        console.log("Aaaaaaaaaaaaaaa")
        control.setErrors(si ? {notSelected : true} : null)
        return !si ? {notSelected : true}:null;
      
      
      }
      console.log("uuuuuuuuuuu")
      return null;
    };
  }
  
  calcularTotal() {
    let total = 0;
    this.productosSeleccionados.controls.forEach(group => {
      const cantidad = group.get('cantidad')?.value || 0;
      const precio = group.get('precio')?.value || 0;
      total += cantidad * precio;
    });
    this.formulario.get('total')?.setValue(total);
  }


 loadProductosDisponibles(){
  this.service.get().subscribe( (data : Producto [] ) => {
    
    this.productosDisponibles = data
    console.log(this.productosDisponibles)
    });
  }


  //validamos que solo hayaun producto
   validateUniqueProduct(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (!(formArray instanceof FormArray)) return null;
  
      const selectedValues = formArray.controls.map(group => group.get('selectedProduct')?.value);
      const duplicates: string[] = [];
      
      // Encuentra todos los valores duplicados
      selectedValues.forEach((value, index) => {
        if (value && selectedValues.indexOf(value) !== index) {
          duplicates.push(value);
        }
      });
  
      // Asigna el error a los controles duplicados
      formArray.controls.forEach((group, index) => {
        const selectedProductControl = group.get('selectedProduct');
        if (selectedProductControl) {
          const isDuplicate = duplicates.includes(selectedValues[index]);
          selectedProductControl.setErrors(isDuplicate ? { duplicateProduct: true } : null);
        }
      });
  
      return duplicates.length > 0 ? { duplicateProductArray: true } : null;
    };
  }

  //validamos que solo hayaun producto
  validateSelected(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (!(formArray instanceof FormArray)) return null;
  
      const selectedValues = formArray.controls.map(group => group.get('selectedProduct')?.value);
     
      
      
  
      // Asigna el error a los controles selected
      let condicion = false
      formArray.controls.forEach((group, index) => {
        const selectedProductControl = group.get('selectedProduct');
        if (selectedProductControl) {
          const valor = selectedProductControl.value
          if( valor === ""|| valor ===null || valor=== undefined){
           condicion = true
          selectedProductControl.setErrors(condicion ? { notSelected: true } : null);
          }
        }
      });
  
      return condicion ? { notSelectedProductoArray : true } : null;
    };
  }



}
