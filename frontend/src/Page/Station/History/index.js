import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Scrollbar from 'react-scrollbar';
import { withStyles } from 'material-ui/styles';
import Item from './Item';
import styles from './styles';

class History extends Component {
  render() {
    const { className, style, history, classes } = this.props;
    return (
      <Grid
        item
        xs={12}
        className={className}
        style={{ ...style, overflowY: 'auto' }}
      >
        <Scrollbar
          className={classes.container}
          horizontal={false}
          smoothScrolling
          stopScrollPropagation
        >
          <List style={{ paddingTop: 0, paddingBottom: 0 }}>
            {history.map((video, index) => (
              <Item key={index} {...video} playing={index === 0} />
            ))}
          </List>
        </Scrollbar>
      </Grid>
    );
  }
}

History.propTypes = {
  className: PropTypes.any,
  classes: PropTypes.object,
  style: PropTypes.any,
  history: PropTypes.array,
};

export default compose(withStyles(styles))(History);
