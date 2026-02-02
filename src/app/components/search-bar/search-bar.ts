import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {

  // Contient le texte tapé par l’utilisateur (lié via ngModel)
  term = '';

  // Event envoyé au parent à chaque changement de valeur
  @Output() termChange = new EventEmitter<string>();

  onTermInput(): void {
    // On émet une version "nettoyée" (trim) pour éviter les espaces parasites
    this.termChange.emit(this.term.trim());
  }

  clear(): void {
    this.term = '';
    this.termChange.emit('');
  }

}
