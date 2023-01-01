const person = {
    name: 'Liza',
    age: 30,
    // greet: function() {
    greet() {
        console.log('Hi, I am ' + this.name)
    }
}

const printName_1 = (personData) => {
    console.log(personData.name)
}

const printName_2 = ({name, age}) => {
    console.log(name + ' - ' + age)
}

printName_1(person)
printName_2(person)

const {name, age} = person

console.log(name, age)

const colors = ['red', 'blue', 'green']
const [color1, color2] = colors

console.log(color1, color2)