const colors = ['red', 'green', 'blue']
const copiedColors_1 = colors.slice()
const copiedColors_2 = [...colors, 'yellow']

console.log(colors)
console.log(copiedColors_1)
console.log(copiedColors_2)

const toArray_1 = (arg1, arg2, arg3) => {
    return [arg1, arg2, arg3]
}

const toArray_2 = (...args) => {
    return args
}

console.log(toArray_1(3, 7, 11))
console.log(toArray_2(3, 7, 11, 8))