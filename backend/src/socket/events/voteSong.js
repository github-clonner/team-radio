import * as stationController from '../../controllers/station';
import * as userController from '../../controllers/user';
import * as EVENTS from '../../const/actions';
import * as VOTE from '../index';
import skipDecider from '../managers/skipDecider';
import createEmitter from '../managers/createEmitter';

export default (action, io, socket, userId, stationId, songId) => {
  if (action === VOTE.UPVOTE_ACTION) {
    _upVoteSong(io, socket, userId, stationId, songId);
  } else if (action === VOTE.DOWNVOTE_ACTION) {
    _downVoteSong(io, socket, userId, stationId, songId);
  } else console.log('Vote Action Unknow!');
};

const _upVoteSong = async (io, socket, userId, stationId, songId) => {
  const emitter = createEmitter(socket, io);

  // Check if anonymous user try to vote song
  if (userId === '0') {
    emitter.emit(EVENTS.SERVER_UPVOTE_SONG_FAILURE, {
      message: 'You need to login to use this feature!',
    });
    return;
  }

  try {
    // Check if userId is exist, allow vote song
    // If not, throw an error and emit message to user
    await userController.getUserById(userId);
    const playlist = await stationController.upVote(stationId, songId, userId);

    // Skip song decision when vote change
    skipDecider(io, stationId);

    // Emit result
    emitter.emit(EVENTS.SERVER_UPVOTE_SONG_SUCCESS, {});
    emitter.emitToStation(stationId, EVENTS.SERVER_UPDATE_PLAYLIST, {
      playlist: playlist,
    });
  } catch (err) {
    emitter.emit(EVENTS.SERVER_UPVOTE_SONG_FAILURE, {
      message: err.message,
    });
  }
};

const _downVoteSong = async (io, socket, userId, stationId, songId) => {
  const emitter = createEmitter(socket, io);

  // Check if anonymous user try to vote song
  if (userId === '0') {
    emitter.emit(EVENTS.SERVER_DOWNVOTE_SONG_FAILURE, {
      message: 'You need to login to use this feature!',
    });
    return;
  }

  try {
    // Check if userId is exist, allow vote song
    // If not, throw an error and emit message to user
    await userController.getUserById(userId);
    const playlist = await stationController.downVote(
      stationId,
      songId,
      userId,
    );

    // Skip song decision when vote change
    skipDecider(io, stationId);

    // Emit result
    emitter.emit(EVENTS.SERVER_DOWNVOTE_SONG_SUCCESS, {});
    emitter.emitToStation(stationId, EVENTS.SERVER_UPDATE_PLAYLIST, {
      playlist: playlist,
    });
  } catch (err) {
    emitter.emit(EVENTS.SERVER_DOWNVOTE_SONG_FAILURE, {
      message: err.message,
    });
  }
};
