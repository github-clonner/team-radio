import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import { FormHelperText } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';

import { addUser } from 'Redux/api/user/actions';
import { Field, reduxForm } from 'redux-form';

import { NavBar, TextView } from 'Component';
import { withNotification } from 'Component/Notification';

import { saveAuthenticationState } from 'Configuration';
import {
  registerValidate,
  required,
  email,
  minLength6,
  maxLength15,
} from 'Util/validate';

import styles from './styles';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asyncError: '',
      benefits: [
        'Edit profile',
        'Increase your reputation',
        'Play more songs than these anonymous freaks',
        'See some information of the past activities',
      ],
    };

    this._showNotification = this._showNotification.bind(this);
    this._renderGuidline = this._renderGuidline.bind(this);
    this._renderHeadline = this._renderHeadline.bind(this);
    this._renderRegisterLocalForm = this._renderRegisterLocalForm.bind(this);
    this._renderRegisterLocalActions = this._renderRegisterLocalActions.bind(
      this,
    );
    this._renderBackground = this._renderBackground.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { addUserResponse: { error, data, isAuthenticated } } = nextProps;
    const { addUserResponse: { data: { token } } } = this.props;

    if (error !== null) {
      this.setState({
        asyncError: error.response.message,
      });
    } else if (isAuthenticated && token !== data.token) {
      this._showNotification('Register successfully!');

      saveAuthenticationState(data);
      if (window.history.length > 2) {
        this.props.history.go(-1);
      } else {
        this.props.history.replace('/');
      }
      // this.props.history.push('/');
    }
  }

  _showNotification(content) {
    const { notification } = this.props;

    notification.app.success({
      message: content,
    });
    // notification.browser.success({
    //   message: content,
    // });
  }

  _renderGuidline() {
    const { classes } = this.props;
    return (
      <CardContent>
        <Typography type="headline" component="h2" className={classes.text}>
          A registered user can:
        </Typography>
        <ul className={classes.listWrapper}>
          {this.state.benefits.map((benefit, index) => (
            <li key={index} className={classes.listItem}>
              <Icon>done</Icon>
              <span className={classes.listText}>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    );
  }

  _renderHeadline() {
    return (
      <Grid style={{ paddingBottom: '2em' }}>
        <Typography type="headline" component="h2">
          Sign Up
        </Typography>
        <Typography component="p">to get the most out of Team Radio</Typography>
      </Grid>
    );
  }

  _renderRegisterLocalForm() {
    const { classes, submitSucceeded } = this.props;
    return [
      <Field
        key={1}
        name="name"
        placeholder="Enter your full name"
        type="text"
        component={TextView}
        label="Full name"
        validate={[required, maxLength15]}
      />,
      <Field
        key={2}
        name="email"
        placeholde="hello@example.com"
        type="text"
        component={TextView}
        label="Email"
        validate={[required, email]}
      />,
      <Field
        key={3}
        name="password"
        placeholder="Must be at least 6 characters"
        type="password"
        component={TextView}
        label="Password"
        validate={[required, minLength6]}
      />,
      <Field
        key={4}
        name="confirmPassword"
        placeholder="Re-enter your password"
        type="password"
        component={TextView}
        label="Confirm Password"
        validate={[required]}
      />,
      <FormHelperText key={5} className={classes.error}>
        {submitSucceeded && this.state.asyncError}
      </FormHelperText>,
    ];
  }

  _renderRegisterLocalActions() {
    const { classes, loading } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              raised
              color="primary"
              type="submit"
              className={classes.buttonSend}
            >
              Sign up
            </Button>
          )}

          <FormHelperText className={classes.callout}>
            <span>Already have an account?</span>
            <Link to="/auth/login" className={classes.link}>
              Login
            </Link>
          </FormHelperText>
        </Grid>
      </Grid>
    );
  }

  _renderBackground() {
    const { classes } = this.props;
    return (
      <Grid item xs className={classes.backgroundImg}>
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=2250&q=80"
          alt="Team Radio - Cover"
          className={classes.backgroundImg}
        />
      </Grid>
    );
  }

  render() {
    const { classes, handleSubmit } = this.props;
    return (
      <div>
        <NavBar />
        <Grid container direction="column" className={classes.container}>
          <Grid container className={classes.foreground}>
            <Grid
              item
              xs={1}
              sm={5}
              className={classNames([
                classes.cardWrapper,
                classes.cardInfoWrapper,
              ])}
            >
              <Card className={classes.cardInfo}>{this._renderGuidline()}</Card>
            </Grid>
            <Grid item xs={11} sm={5} className={classes.cardWrapper}>
              <Card raised className={classes.cardForm}>
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    {this._renderHeadline()}
                    {this._renderRegisterLocalForm()}
                  </CardContent>
                  <CardActions>
                    {this._renderRegisterLocalActions()}
                  </CardActions>
                </form>
              </Card>
            </Grid>
            {this._renderBackground()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  addUserResponse: PropTypes.any,
  history: PropTypes.any,
  classes: PropTypes.any,
  loading: PropTypes.bool,
  handleSubmit: PropTypes.any,
  submitSucceeded: PropTypes.any,
};

const mapDispatchToProps = dispatch => ({
  onSubmit: values => {
    dispatch(addUser(values));
  },
});

const mapStateToProps = state => ({
  addUserResponse: state.api.user,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'registerForm',
    validate: registerValidate,
  }),
  withStyles(styles),
  withNotification,
)(Register);
