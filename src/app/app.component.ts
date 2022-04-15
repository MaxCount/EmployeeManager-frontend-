import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {error} from "@angular/compiler/src/util";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[] ;
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;
  constructor(private employeeService: EmployeeService) {
    this.employees = [];
  }

  ngOnInit() {
    this.getEmployees()
  }



  public onOpenModal(mode: string, employee?: Employee): void {
    const container  = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode === 'edit'){
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public getEmployees(): void{
    this.employeeService.getEmployees()
      .subscribe({
        next: (responce:Employee[]) => {
          this.employees = responce;
          console.log(this.employees)
        },
        error: (HttpErrorResponse) => {
          alert(HttpErrorResponse)
        }
      });

  }

  public onAddEmloyee(addForm: NgForm): void {
    document.getElementById('add-employee-form')!.click() ;
    this.employeeService.addEmployee(addForm.value)
      .subscribe({
        next: (responce:Employee) => {
          console.log(responce)
          this.getEmployees()
          addForm.reset();
        },
        error: (HttpErrorResponse) => {
          alert(HttpErrorResponse)
          addForm.reset();
        }
    });
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee)
      .subscribe({
        next: (responce: Employee) => {
          console.log(responce);
          this.getEmployees();
        },
        error: (HttpErrorResponse) => {
          alert(HttpErrorResponse);
        }
      });
  }

  public onDeleteEmloyee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId)
      .subscribe({
        next: (responce:void) =>{
          console.log(responce)
          this.getEmployees()
        },
        error: (HttpErrorResponse)=>{
          alert((HttpErrorResponse))
        }
      });
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

}
