import { ConfirmationDialogComponent } from './../../components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../shared/componentes/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { catchError, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | null = null;

  constructor(private courseService: CoursesService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
    this.refresh();
  }

  refresh(){
    this.courses$ = this.courseService.list().pipe(
      catchError(error => {
        this.onError('Erro ao carregar cursos')
        return of([])
      })
    )
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    })
  }

  onAdd() {
    console.log("Adicionado!");
    this.router.navigate(['new'], { relativeTo: this.route })
  }
  onEdit(course: Course){
    this.router.navigate(['edit', course._id], { relativeTo: this.route })
  }

  onDelete(course: Course){

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: "Tem certeza que deseja remover esse curso?",
      });

      dialogRef.afterClosed().subscribe((result : boolean) => {
        if(result){
          this.courseService.delete(course._id).subscribe(()=>{
            this.refresh()
            this._snackBar.open('Curso removido com sucesso!', 'X', { duration: 5000, verticalPosition:'top', horizontalPosition: 'center' });

          },
          () => this.onError("Erro ao tentar remover curso")
          )
        }
      }) 
  }

  ngOnInit(): void {
  }

}

