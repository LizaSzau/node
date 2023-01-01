const name = 'Liza'
let age = 28
const hasHobby = true

age = 30

function summarizeUser(userName, userAge, userHasHobby) {
    return ('Name is ' + userName + ', age is ' + userAge + ', and the user has hobby: ' + userHasHobby)
}

console.log(summarizeUser(name, age, hasHobby))