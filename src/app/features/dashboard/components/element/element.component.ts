import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import { SortyElement } from "../../../../types/sorty-element.type";

@Component({
	selector: "sorty-element",
	imports: [NgClass],
	templateUrl: "./element.component.html",
	host: {
		class: "flex flex-col w-6 flex-none justify-end h-full gap-4"
	}
})
export class ElementComponent {
	public readonly element = input.required<SortyElement<unknown>>();
	public readonly selected = input.required<boolean>();
	public readonly swapped = input.required<boolean>();
}
