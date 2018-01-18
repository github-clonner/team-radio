import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import { NavBar, Footer } from 'Component';
import { getUserByUsername } from 'Redux/api/userProfile/actions';
import { withNotification } from 'Component/Notification';
import sleep from 'Util/sleep';

import Header from './Header';
import Body from './Body';
import styles from './styles';

/* eslint-disable no-shadow */
class Profile extends Component {
  constructor(props) {
    super(props);

    this._showNotification = this._showNotification.bind(this);
  }

  componentWillMount() {
    const { match: { params } } = this.props;
    this.props.requestUserByUsername(params.username);
  }

  async componentWillReceiveProps(nextProps) {
    const { user, user: { message }, match: { params } } = nextProps;
    console.log(params.username);

    if (params.username !== this.props.match.params.username) {
      this.props.requestUserByUsername(params.username);
      return;
    }

    const currentUser = this.props.user;
    const increaseNumber = Profile._calculateIncreaseReputation(
      currentUser.reputation,
      user.reputation,
    );

    if (message !== currentUser.message && message) {
      this._showNotification(message);
    }

    // show notification when user upload avatar on the first timeT
    // TOFIX
    // if (
    //   currentUser.avatar_url !== user.avatar_url &&
    //   currentUser.avatar_url === null &&
    //   increaseNumber !== 0
    // ) {
    //   await sleep(1000);
    //   this._showNotification(
    //     `Congratulations! You just got ${increaseNumber} for a gift!`,
    //   );
    // }
  }

  static _renderLoading() {
    return <CircularProgress />;
  }

  static _calculateIncreaseReputation(oldNumber, newNumber) {
    return newNumber - oldNumber;
  }

  _showNotification(content) {
    const { notification } = this.props;

    notification.app.success({
      message: content,
    });
  }

  render() {
    const { classes, user, isOwner } = this.props;
    let content = null;

    if (Object.keys(user).length === 0) {
      content = <CircularProgress />;
    } else {
      content = (
        <Grid
          key={2}
          direction="row"
          container
          className={classes.containerWrapper}
        >
          <Header user={user} isDisabled={isOwner} />
          <Body user={user} isDisabled={isOwner} />
        </Grid>
      );
    }

    return (
      <Fragment>
        <NavBar key={1} color="primary" />
        {content}
        <Footer key={3} />
      </Fragment>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.any,
  fetchUserWithUsername: PropTypes.func,
  user: PropTypes.object,
  userProfile: PropTypes.object,
  loading: PropTypes.bool,
  isOwner: PropTypes.bool,
  requestUserByUsername: PropTypes.func,
  notification: PropTypes.object,
  match: PropTypes.any,
};

const mapStateToProps = ({ api }) => ({
  user: api.userProfile.data,
  isOwner: api.userProfile.data.isOwner,
  loading: api.user.loading,
});

const mapDispatchToProps = dispatch => ({
  requestUserByUsername: username => dispatch(getUserByUsername(username)),
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withNotification,
)(Profile);