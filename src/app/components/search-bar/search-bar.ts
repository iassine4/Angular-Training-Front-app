import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent {

  // Contient la valeur tapée dans l'input par l’utilisateur (lié via ngModel)
  term = '';

  /**
   * Output (= événement) émis vers le parent.
   * Le parent écoutera : (termChange)="..."
   */
  @Output() termChange = new EventEmitter<string>();

  /**
   * Appelé à chaque changement de l'input.
   * On stocke la valeur et on la "push" au parent.
   */
  onTermInput(): void {
    // On émet une version "nettoyée" (trim) pour éviter les espaces parasites
    this.termChange.emit(this.term.trim());
  }

  onSearch() {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    this.term = '';
    this.termChange.emit('');
  }

}
