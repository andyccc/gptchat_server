const FIND_USER_BY_DEVICE_NUMBER = 'SELECT id, count, vip_expire_unix, advert_residue,product_id from `users` WHERE device_number = ?';

const UPDATE_USER_EXPIRE_BY_ID = `
    UPDATE users set time_updated = NOW(), vip_expire_unix = 0, product_id = NULL WHERE id = ? AND vip_expire_unix <= UNIX_TIMESTAMP()*1000;
`;

const UPDATE_USER_PAYMENT_BY_ID = `
    UPDATE users set time_updated = NOW(), vip_expire_unix = ?, product_id = ? WHERE id = ?;
`;

const INSERT_USER = `
    INSERT users ( vip_expire_unix, count, advert_residue, device_number, timezone ) 
    VALUE
        ( ?, ?, ?, ?, ? );
`;

const FIND_USER_BY_ID = 'SELECT * from `users` WHERE id = ?';

module.exports = {
  INSERT_USER,
  UPDATE_USER_PAYMENT_BY_ID,
  UPDATE_USER_EXPIRE_BY_ID,
  FIND_USER_BY_DEVICE_NUMBER,
  FIND_USER_BY_ID,

};
