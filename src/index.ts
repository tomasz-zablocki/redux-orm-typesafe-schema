import MyPartial from "./partial-class";



for (let i in MyPartial) {
  console.log('static',i)
}

for (let i in MyPartial.prototype) {
  console.log('proto', i)
}

const obj = new MyPartial({text:'text'})


type modelType= typeof MyPartial
type instanceType = InstanceType<modelType>

