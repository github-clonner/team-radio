export default ({ spacing }) => ({
  modalHeadline: {
    borderBottom: '1px solid #f2f2f2',
    paddingBottom: 9,
    marginBottom: 10,
    paddingLeft: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1p solid #f2f2f2',
  },
  actions: {
    display: 'flex',
  },
  buttonEditProfile: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  secondButton: {
    position: 'relative',
    '& .backdrop': {
      display: 'none',
    },
    '&:hover > .backdrop': {
      cursor: 'pointer',
      width: spacing.fullWidth,
      height: spacing.fullHeight,
      position: 'absolute',
      content: ' ',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
    },
  },
  content: {
    '& div': {
      flexDirection: 'flex-start',
    },
  },
  error: {
    color: '#ff1744',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  button: {
    marginLeft: spacing.doubleBaseMargin,
  },
  menuItem: {
    cursor: 'pointer',
  },
  modal: {
    position: 'absolute',
    width: '35vw',
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    padding: 32,
  },
});
