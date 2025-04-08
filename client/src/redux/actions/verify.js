export const verifyUserName = (data) => {
    return {
        type: 'USERNAME',
        payload: data
    }
}
export const verifyEmail = (data) => {
    return {
        type: 'EMAIL',
        payload: data
    }
}
export const verifyCode = (data) => {
    return {
        type: 'CODE',
        payload: data,
    }
}