import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'common'
})
export class CommonPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    switch (args[0]) {
      case 'calcBy':
        return (value === 'B') ? 'Boris Calculated' : 'Manual';
        break;
      case 'filterText':
        let searchTerm:any = args[1];
        if (!value || value.length == 0) {
          return [];
        }
        if (!searchTerm || (searchTerm.trim().length < 3)) {
          return value;
        }
        
        searchTerm = searchTerm.toLocaleLowerCase();

        return value.filter((it:any) => {
          return (it.riAgency+" - "+it.treatyName).toLocaleLowerCase().includes(searchTerm);
        });
        break;
    }
  }

}
