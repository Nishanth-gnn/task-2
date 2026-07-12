module.exports = {
    URLS: {
        LOGIN: process.env.CONTROL_ROOM_URL
    },
    LEARNING_INSTANCE: {
        NAME: 'TestLearningInstance',
        DESCRIPTION: 'Assignment Test',
        DOCUMENT_TYPE: 'User-defined'
    },
    FORM_FIELDS: [
        { name: 'invoice_number', label: 'Invoice Number', type: 'Text' },
        { name: 'invoice_date', label: 'Invoice Date', type: 'Date' }
    ],
    TABLE_FIELDS: [
        { name: 'unit_price', label: 'Unit Price', type: 'Number' },
        { name: 'quantity', label: 'Quantity', type: 'Number' }
    ],
    RULES: [
        {
            field: 'invoice_number', // We select this field before rule creation
            name: 'Rule1',
            condition: 'Equal To',
            value: '100',
            action: 'Show Error',
            message: 'Invalid value entered'
        }
    ]
};
