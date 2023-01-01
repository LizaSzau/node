const name = 'Liza'
let age = 28
const hasHobby = true

age = 30

// const summarizeUser = function (userName, userAge, userHasHobby) {
const summarizeUser = (userName, userAge, userHasHobby) => {
    return ('Name is ' + userName + ', age is ' + userAge + ', and the user has hobby: ' + userHasHobby)
}

/*
const add = (a, b) => {
    return a + b
}
*/

const add = (a, b) => a + b
// const addOne = (a) => a + 1
const addOne = a => a + 1
const addRandom = () => 1 + 2

console.log(add(1, 2))
console.log(addOne(6))
console.log(addRandom())
console.log(summarizeUser(name, age, hasHobby))