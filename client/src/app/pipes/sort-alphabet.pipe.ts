import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortAlphabet'
})
export class SortAlphabetPipe implements PipeTransform {
  transform(names: { name: string }[]): { name: string }[] {
    if (!names) {
      return names;
    }

    // Clone the array to avoid modifying the original
    const sortedNames = [...names];
    
    // Sort the objects by the "name" property in alphabetical order
    sortedNames.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return sortedNames;
  }
}