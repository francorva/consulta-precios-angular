
import { afterNextRender, Component, inject } from '@angular/core';
import { LogtoService } from '@logto/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div style="text-align: center; margin-top: 4rem;">
      <h2>Validando inicio de sesión...</h2>
    </div>
  `
})
export class CallbackComponent {

  private logtoService = inject(LogtoService);
  private router = inject(Router);

  constructor() {
    afterNextRender(async () => {
      try {
        await this.logtoService.handleSignInCallback(
          window.location.href
        );

        await this.router.navigate(['/']);

      } catch (error) {
        console.error('Error al manejar el callback:', error);
        await this.router.navigate(['/']);
      }
    });
  }
}
