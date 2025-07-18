import { NgClass } from "@angular/common";
import { Component, computed, input } from "@angular/core";

@Component({
	selector: "sorty-element",
	imports: [NgClass],
	templateUrl: "./element.component.html",
	host: {
		class: "flex flex-col w-6 flex-none justify-end h-full gap-4"
	}
})
export class ElementComponent {
	// TODO: Calculate the heightPercentage of each element in the store and pass it as an input as well as the value
	public readonly value = input.required<number>();
	public readonly selected = input.required<boolean>();
	public readonly max = input.required<number>();
	public readonly min = input.required<number>();

	protected readonly heightPercentage = computed(() => {
		const value = this.value();
		const max = this.max();

		return (value / max) * 100;
	});
}
