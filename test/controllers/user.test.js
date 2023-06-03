/* eslint-disable */
const { request, app, closeMysqlConnection, token, citconToken, errToken, } = require('../common');

describe('About User', () => {
    it('API login',async()=>{
        const apiKey = '6cf5533f-f57f-448f-b53d-727c0e2962e3';
        const params = {
            userName:'test',
            passWord:'test'
        };
        const response = await request(app)
            .post('/v1/login')
            // .set('Authorization', token)
            .set('Api-Key', apiKey)
            .send(params);
        return expect(response.status).toBe(200);
    });


});



afterAll(() => {
    closeMysqlConnection();
});