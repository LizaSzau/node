const hobbies = ['Sports', 'Cooking', 1, true, {
    name: 'apple',
    color: 'red',
    call() {
        console.log('I am a ' + this.color + ' ' + this.name + '.')
    }
}]

console.log(hobbies[4].call())

for(let hobby of hobbies) {
    console.log(hobby)
}

const colors = ['red', 'green', 'yellow']

const colorsNew_1 = colors.map(color => {
    return color + ' is a color'
})

const colorsNew_2 = colors.map(color => 'Color: ' + color)

console.log(colorsNew_1)
console.log(colorsNew_2)