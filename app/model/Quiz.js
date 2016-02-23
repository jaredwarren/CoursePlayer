Ext.define('Player.model.Quiz', {
    extend: 'Ext.data.Model',
    alias: 'model.quiz',
    uses: [
        'Player.model.Question'
    ],
    config: {
        fields: [
            {
                name: 'quizmode'
            },
            {
                name: 'intScore',
                type: 'float'
            },
            {
                defaultValue: 100,
                name: 'intMaxScore',
                type: 'float'
            },
            {
                defaultValue: 0,
                name: 'intMinScore',
                type: 'float'
            },
            {
                defaultValue: 0,
                name: 'points',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'pointsPossible',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'correct',
                type: 'int'
            },
            {
                defaultValue: 0,
                name: 'incorrect',
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'reportScore',
                type: 'boolean'
            },
            {
                defaultValue: 'none',
                name: 'recordStatus',
                type: 'string'
            },
            {
                defaultValue: 70,
                name: 'passingScore',
                type: 'int'
            },
            {
                defaultValue: false,
                name: 'passed',
                type: 'boolean'
            },
            {
                defaultValue: false,
                name: 'complete',
                type: 'boolean'
            }
        ],
        hasMany: {
            associationKey: 'question',
            model: 'Player.model.Question'
        }
    }
});