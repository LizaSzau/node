// SYNC ERRORS

const sum = (a, b) => {
    if (a && b) {
        return a + b
    }
    
    throw new Error('Invalid arguments!')
}

const x_1 = sum(1, 2)

try {
    const x_2 = sum(1)
    console.log(x_2)
} catch (error) {
    console.log('Error occured: invalid argument!')
    // console.log(error)
}

console.log('This works.')

// ASYNC ERRORS