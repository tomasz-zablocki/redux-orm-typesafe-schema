import { attribute, Entity, id } from "./decorators";


@Entity("MyPartial")
export default class MyPartial {
  constructor(...args: any[]) {
    this.id = args[0].id;
    this.text = args[0].text;
    this.num = args[0].num;
  }

  @id()
  id: string;
  @attribute()
  text: string;
  @attribute()
  num: number;
}
