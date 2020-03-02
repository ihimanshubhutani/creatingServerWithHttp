const request = require('request');
const _ = require('lodash');
const config = require('config');

/**
 * This function sends message to userid of Slack
 * @param   userID  {string} Slack id of user to whom message is to be sent.
 * @param   message {string} Message to be sent to user.
 * @returns {void}
 */
const sendMessage = (userID, message) => {

  config.POST_MESSAGE.json.channel = userID;
  config.POST_MESSAGE.json.text = message;

  request.post(config.POST_MESSAGE)
    .on(config.OPTION.ERROR, (error) => console.error(error))
    .on(config.OPTION.RESPONSE, (response) =>
      response.on(config.OPTION.DATA, (data) => {
        const response = JSON.parse(data);

        if (_.isEqual(response.ok, false)) {
          console.error(` ${response.error}`);
          return;
        }

        console.log(config.MESSAGE.SENT);
      }));
}

/**
 * Fetch all members from slack workplace {Right-now from testapipractice.slack.com }
 * @returns {void}
 */
const getUsersList = () => {
  request.get(config.USER_LIST)
    .on(config.OPTION.ERROR, (err) => console.error(err))
    .on(config.OPTION.RESPONSE, (response) =>

      response.on(config.OPTION.DATA, (data) => {
        const users = JSON.parse(data);
        const usernameList = _.map(users.members, i => _.pick(i, [config.OBJECT.REAL_NAME, config.OBJECT.ID]));
        console.log(`${config.MESSAGE.MEMBERS_LIST}`);
        console.log(_.compact(usernameList));
      }));
};

sendMessage('UUPRNU82K', 'HELLO THIS IS TEST MESSAGE');
getUsersList();
