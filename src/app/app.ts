import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CdkAccordionModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
