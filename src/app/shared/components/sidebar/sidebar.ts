import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  toggleHerramientasActive = signal(false);
  toggleVariablesOperativasActive = signal(false);
  
  toggleVariablesOperativas() {
    if (!this.toggleVariablesOperativasActive()) {
      this.toggleVariablesOperativasActive.update(v => !v);
    }
    
    this.toggleHerramientasActive.set(false);
  }

  toggleHerramientas() {
    if (!this.toggleHerramientasActive()) {
      this.toggleHerramientasActive.update(v => !v);
    } 
    this.toggleVariablesOperativasActive.set(false);
  }

  toggleMenu() {
    this.toggleVariablesOperativasActive.set(false);
    this.toggleHerramientasActive.set(false);
  } 
}
