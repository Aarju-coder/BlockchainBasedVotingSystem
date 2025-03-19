import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Election } from '../../types';

interface ElectionState {
  elections: Election[];
  activeElection: Election | null;
  loading: boolean;
}

const initialState: ElectionState = {
  elections: [],
  activeElection: null,
  loading: false,
};

const electionSlice = createSlice({
  name: 'elections',
  initialState,
  reducers: {
    setElections: (state, action: PayloadAction<Election[]>) => {
      state.elections = action.payload;
    },
    setActiveElection: (state, action: PayloadAction<Election | null>) => {
      state.activeElection = action.payload;
    },
    addElection: (state, action: PayloadAction<Election>) => {
      state.elections.push(action.payload);
    },
    updateElection: (state, action: PayloadAction<Election>) => {
      const index = state.elections.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.elections[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setElections,
  setActiveElection,
  addElection,
  updateElection,
  setLoading,
} = electionSlice.actions;
export default electionSlice.reducer;