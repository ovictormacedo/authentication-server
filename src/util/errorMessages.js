exports.BadRequestResult = (message, parameter) => {
    return {errors: [{msg: message, param: parameter}]};
}