const INSERT_USER_CHAT = `
    INSERT user_chats ( user_id, platform, question, answer ,ver) 
    VALUE
        ( ?, ?, ?, ?, ? );
`;

module.exports = {
  INSERT_USER_CHAT,
};
