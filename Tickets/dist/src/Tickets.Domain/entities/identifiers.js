"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecordId = exports.TicketWorkId = exports.ServiceObjectId = void 0;
exports.ServiceObjectId = {
    from: (id) => {
        if (!id)
            throw new Error('ServiceObjectId cannot be empty');
        return id;
    },
    isValid: (id) => {
        return typeof id === 'string' && id.length > 0;
    }
};
exports.TicketWorkId = {
    from: (id) => {
        if (!id)
            throw new Error('TicketWorkId cannot be empty');
        return id;
    },
    isValid: (id) => {
        return typeof id === 'string' && id.length > 0;
    }
};
exports.TicketRecordId = {
    from: (id) => {
        if (!id)
            throw new Error('TicketRecordId cannot be empty');
        return id;
    },
    isValid: (id) => {
        return typeof id === 'string' && id.length > 0;
    }
};
//# sourceMappingURL=identifiers.js.map