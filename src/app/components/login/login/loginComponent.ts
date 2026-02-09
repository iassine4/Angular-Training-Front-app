import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './loginComponent.html',
  styleUrl: './loginComponent.css',
})
export class LoginComponent {

  public email = '';
  public password = '';     
  public errorMessage = '';

  public readonly emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    console.log('[Login] constructor');
  }

  public onSubmit(form: NgForm): void {

    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire.';
      return;
    }
    console.log('[Login] submit', { email: this.email, password: this.password });//--

    const ok = this.authService.login(this.email, this.password);

    console.log('[Login] ok =>', ok);//--
    console.log('[Login] localStorage(auth_user) =>', localStorage.getItem('auth_user'));//--

    if (!ok) {
      this.errorMessage = 'Identifiants incorrects.';
      return;
    }

    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? '/trainings';
    this.router.navigateByUrl(returnUrl);
  }

}
