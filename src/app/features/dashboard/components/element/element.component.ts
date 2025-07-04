import { Component, computed, input } from "@angular/core";

@Component({
	selector: "sorty-element",
	imports: [],
	templateUrl: "./element.component.html",
	host: {
		class: "flex max-w-16 min-w-16 items-end"
	}
})
export class ElementComponent {
	public readonly value = input.required<number>();
	public readonly max = input.required<number>();
	public readonly min = input.required<number>();

	protected readonly maxHeight = computed(() => {
		const value = this.value();
		const max = this.max();

		return Math.round((value / max) * 100);
	});
}
