import config from 'config';
import _ from 'lodash';
import moment from 'moment';
import { get, post } from 'request';

/**
 * Displays list of users from slack workplace.
 * @param {array} membersList - Array of objects of users from slack workplace.
 */
const showUserList = (membersList) => {
  const username = config.OBJECT.REAL_NAME;
  const userID = config.OBJECT.ID;
  const usernameList = _.map(membersList.members,
    i => _.pick(i, [username, userID]));
  console.log(`${config.MESSAGE.MEMBERS_LIST}`);
  console.log(_.compact(usernameList));
};

/**
 * This function sends message to userid of Slack
 * @param   {string} userID  Slack id of user to whom message is to be sent.
 * @param   {string} message  Message to be sent to user.
 * @returns {void}
 */
const sendMessage = (userID, message) => {
  config.POST_MESSAGE.json.channel = userID;
  config.POST_MESSAGE.json.text = message;

  post(config.POST_MESSAGE)
    .on(config.OPTION.ERROR, error => console.error(error))
    .on(config.OPTION.RESPONSE, response => response.on(
      config.OPTION.DATA, (data) => {
        const fetchedData = JSON.parse(data);

        if (_.isEqual(fetchedData.ok, false)) {
          console.error(` ${fetchedData.error}`);
          return;
        }

        console.log(config.MESSAGE.SENT);
      },
    ));
};

/**
 * Fetch all members from slack workplace {Right-now from testapipractice.slack.com }
 * @returns {void}
 */
const getMembersList = () => {
  get(config.USER_LIST)
    .on(config.OPTION.ERROR, err => console.error(err))
    .on(config.OPTION.RESPONSE, response => response.on(
      config.OPTION.DATA, data => {
        showUserList(JSON.parse(data));
      },
    ));
};

getMembersList();
sendMessage('UUPRNU82K', `${config.MESSAGE.TIME} ${moment().format(config.FORMAT.TIME)}`);
