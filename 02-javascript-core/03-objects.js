const person = {
    name: 'Liza',
    age: 30,
    // greet: function() {
    greet() {
        console.log('Hi, I am ' + this.name)
    }
}

person.greet()