import { query as queryUsers, queryCurrent, add, remove, edit } from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {
      userName: '01371059',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      yield call(add, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *edit({ payload, callback }, { call }) {
      yield call(edit, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(remove, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *fetchCurrent(_, { call, put }) {
      const res = yield call(queryCurrent);
      if (!res) return null;
      if (res.role) {
        yield setAuthority(res.role);
        yield put({
          type: 'saveCurrentUser',
          payload: res,
        });
      } else {
        yield window.location.href = '/#/exception/403';
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
