<script setup lang="ts">
import { ref, computed } from "vue";

enum Player {
  X = "X",
  O = "O",
}

type Row = (Player | null)[];
type Board = Row[];

const player = ref(Player.X);
const board = ref<Board>([
  [null, null, null],
  [null, null, null],
  [null, null, null],
]);

const getWinningLine = () => {
  for (let x = 0; x < 3; x++) {
    const row = board.value[x];
    if (row[0] && row[0] === row[1] && row[0] === row[2]) {
      return {
        player: row[0],
        positions: [
          [x, 0],
          [x, 1],
          [x, 2],
        ],
      };
    }
  }

  for (let y = 0; y < 3; y++) {
    const col = [board.value[0][y], board.value[1][y], board.value[2][y]];
    if (col[0] && col[0] === col[1] && col[0] === col[2]) {
      return {
        player: col[0],
        positions: [
          [0, y],
          [1, y],
          [2, y],
        ],
      };
    }
  }

  if (
    board.value[0][0] &&
    board.value[0][0] === board.value[1][1] &&
    board.value[0][0] === board.value[2][2]
  ) {
    return {
      player: board.value[0][0],
      positions: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    };
  }

  if (
    board.value[0][2] &&
    board.value[0][2] === board.value[1][1] &&
    board.value[0][2] === board.value[2][0]
  ) {
    return {
      player: board.value[0][2],
      positions: [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    };
  }

  return null;
};

const winningLine = computed(() => getWinningLine());

const winner = computed(() =>
  winningLine.value ? winningLine.value.player : null,
);

const isTie = computed(() => {
  return !board.value.flat().includes(null) && !winner.value;
});

const isOver = computed(() => !!winner.value || isTie.value);

const isWinningCell = (x: number, y: number) => {
  return (
    winningLine.value &&
    winningLine.value.positions.some((pos) => pos[0] === x && pos[1] === y)
  );
};

const onNextPlayer = () => {
  player.value = player.value === Player.X ? Player.O : Player.X;
};

const onMove = (x: number, y: number) => {
  if (board.value[x][y] !== null) return;
  board.value[x][y] = player.value;

  onNextPlayer();
};

const onReset = () => {
  board.value = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  player.value = Player.X;
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title mb-4">Tic-Tac-Toe</h1>

    <div class="controls mb-1">
      <Transition name="slide-fade" mode="out-in">
        <h2 v-if="isTie" data-test="tie" class="controls__message">
          It's a tie!
        </h2>
        <h2 v-else-if="winner" data-test="winner" class="controls__message">
          Player <b>{{ winner }}</b> wins!
        </h2>
        <h2 v-else data-test="player">
          Player <b>{{ player }}</b
          >'s turn
        </h2>
      </Transition>

      <button class="controls__reset" @click="onReset">New Game</button>
    </div>

    <div class="board">
      <div v-for="(row, x) in board" :key="x" class="board__row">
        <button
          v-for="(col, y) in row"
          :key="y"
          :disabled="!!col || isOver"
          data-test="cell"
          :class="{ 'board__col--winning': isWinningCell(x, y) }"
          class="board__col"
          @click="onMove(x, y)"
        >
          {{ col }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.wrapper {
  @apply flex flex-col justify-center items-center;
  @apply h-screen;
}

.title {
  @apply text-3xl font-bold;
}

.controls {
  @apply flex items-center justify-between;
  @apply w-full max-w-96;
  @apply px-1;
}

.controls__message {
  @apply font-medium;
}

.controls__reset {
  @apply bg-orange-500 text-white;
  @apply rounded-md;
  @apply px-2;
}

.board {
  @apply flex flex-col;
  @apply w-full h-full max-w-96 max-h-96;
  @apply bg-white;
  @apply rounded-lg;
  @apply border border-gray-300;
  @apply shadow-sm;
  @apply overflow-hidden;
}

.board__row {
  @apply flex;
  @apply w-full h-1/3;
}

.board__col {
  @apply w-1/3 h-full;
  @apply text-lg font-medium;
}

.board__col--winning {
  @apply bg-yellow-100;
}

.board__col + .board__col {
  @apply border-l;
}

.board__row + .board__row {
  @apply border-t;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-in;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}
.slide-fade-enter-from {
  transform: translateY(-12px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
