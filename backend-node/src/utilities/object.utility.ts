export class ObjectUtility {
  static cleanObject(obj: { [key: string]: any }) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }
}
