const INSERT_ORDER = 'INSERT INTO `ORDERS` ( product_id, user_id, platform )VALUES ( ?, ?, ? );';

const FIND_ORDER_BY_ID = 'SELECT * FROM `ORDERS` WHERE ID = ? and user_id = ? and product_id = ?;';
const FIND_ORDER_BY_PRODUCT_ID = 'SELECT * FROM `ORDERS` WHERE user_id = ? and product_id = ?;';

const UPDATE_ORDER_BY_ID = 'UPDATE `ORDERS` SET time_updated = NOW(), status = ?, transaction_id = ?, transaction_receipt = ?, transaction_purchase_date = ?, original_transaction_id = ?, transaction_expiration_date = ?, quantity = ? WHERE id = ?;';

const FIND_ORDER_BY_TRANSACTION_ID = 'SELECT * FROM `ORDERS` WHERE status in (1,2) and original_transaction_id = ? and product_id = ?;';

const UPDATE_ORDER_OWNER_BY_ID = 'UPDATE `ORDERS` SET time_updated = NOW(), user_id = ?, status = ? WHERE id = ?;';
const UPDATE_ORDER_STATUS_BY_ID = 'UPDATE `ORDERS` SET time_updated = NOW(), status = ? WHERE id = ?;';

module.exports = {
  INSERT_ORDER,
  FIND_ORDER_BY_ID,
  FIND_ORDER_BY_PRODUCT_ID,
  UPDATE_ORDER_BY_ID,
  FIND_ORDER_BY_TRANSACTION_ID,
  UPDATE_ORDER_OWNER_BY_ID,
  UPDATE_ORDER_STATUS_BY_ID,
};
