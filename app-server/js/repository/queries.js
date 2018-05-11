let queries = {
    selectUserId: {
        query: 'select id from vmpgdb.member where name = $1',
        param: ['레몬티']
    }
}

module.exports = queries;