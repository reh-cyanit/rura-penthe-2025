import { AfterViewInit, Component, computed, ContentChild, contentChild, ElementRef, inject, OnDestroy, signal, TemplateRef, ViewChild, viewChild, WritableSignal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { Registration } from "../registration/registration";
import { WhatsIs } from "../whats-is/whats-is";
import { Termin } from "../termin/termin";
import { Impressum } from "../impressum/impressum";
import { Calculator } from "../calculator/calculator";
import { Collapsible } from "../../components/collapsible/collapsible";

@Component({
  selector: "app-rura-penthe",
  imports: [
    RouterOutlet,
    CdkAccordionModule,
    WhatsIs,
    Termin,
    Registration,
    Impressum,
    Calculator,
    Collapsible
],
  templateUrl: "./rura-penthe.html",
  styleUrl: './rura-penthe.css'
})

export class RuraPenthe  {
  @ViewChild("colWhatsIs") colWhatsIs!: Collapsible; 
  @ViewChild("colTermin") colTermin!: Collapsible;
  @ViewChild("colCalcalculator") colCalcalculator!: Collapsible;
  @ViewChild("colRegistration") colRegistration!: Collapsible;
  @ViewChild("colImpressum") colImpressum!: Collapsible;

  protected openCollapsible(col: string) {
    
      if (col === "calculator") {
        this.colWhatsIs.setOpen(false);
        this.colTermin.setOpen(false);
        this.colCalcalculator.setOpen(true);
        this.colRegistration.setOpen(false);
        this.colImpressum.setOpen(false);
      }
  }
}
