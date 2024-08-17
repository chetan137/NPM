function handleError(error) {
    console.error(error);
    throw new Error(error.message);
}

module.exports = handleError;
