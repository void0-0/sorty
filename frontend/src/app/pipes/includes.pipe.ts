import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "includes" })
export class IncludesPipe implements PipeTransform {
	public transform<T>(value: T[], target: T, fromIndex?: number): boolean {
		return value.includes(target, fromIndex);
	}
}
