import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolPipe'
})
export class BoolPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value == 1 ? "Истина" : "Ложь";;
  }

}
