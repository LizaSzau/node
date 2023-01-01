const fetchData_1 = callback => {
    setTimeout(() => {
        callback('Done 1')
    }, 1500)
}

const fetchData_2 = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done 2')
        }, 1500)
    })
    return promise
}
 

setTimeout(() => {
    console.log('Timer is done.')

    fetchData_1(text => {
        console.log(text)
    })

    fetchData_2().then(text_1 => {
        console.log(text_1)
        return fetchData_2()
    })
    .then(text_2 => {
        console.log(text_2)
    })
}, 2000)

console.log('Hello')
console.log('Hi')