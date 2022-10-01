class ErrorResponse extends Error {
    constructor(message, statusCode, data, serverMessage) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.serverMessage = serverMessage
    }

}

module.exports = ErrorResponse