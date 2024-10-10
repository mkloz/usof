export default class StringHelper {
  public static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public static capitalizeEach(str: string): string {
    return str
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  public static toCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase(),
    );
  }
}
