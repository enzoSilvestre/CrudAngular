import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../services/courses.service';
import { Course } from '../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuider.group({
    _id: [''],
    name: ['', [Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100)]],
    category: ['', [Validators.required]]
  });

  constructor(private formBuider: NonNullableFormBuilder,
     private service: CoursesService,
      private _snackBar: MatSnackBar,
       private location: Location,
       private route: ActivatedRoute){
    //this.form
   }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course']
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category
    })
  }

  onSubmit() {
    this.service.save(this.form.value)
      .subscribe(result => this.onSuccess(), error => this.onError());
  }

  onCancel(){
    this.location.back()
  }

  private onSuccess() {
    this._snackBar.open('Curso salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this._snackBar.open('Erro ao salvar curso.', '', { duration: 5000 });
  }


  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 200;
      return `Tamanho máximo excedido de ${requiredLength} caracteres.`;
    }

    return 'Campo Inválido';
  }
}
